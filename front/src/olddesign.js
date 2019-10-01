import React, { Component } from 'react';
import './App.css';
import * as ReactDOM from 'react-dom';
import style from 'bootstrap/dist/css/bootstrap.css';
import * as NeoVis from 'neovis.js/dist/neovis.js';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
      data: null,
      firstCity: "",
      secondCity: "",
      resultWay: "",
      resultDist: "Кратчайшее расстояние: ",
      cities: [],
      add: "",
      addRel: "",
      viz: [],
    };
  }

  draw = async () =>  {
    var cw = $('#viz').width();
    console.log(cw);
    $('#viz').css({'height':cw+'px'});
    var config = {
      container_id: "viz",
      server_url: "bolt://localhost:7687",
      server_user: "neo4j",
      server_password: "lotusflower99",
      labels: {
          "City": {
              caption: "name",
              size: "pagerank",
              community: "community"
          }
      },
      relationships: {
          "CAN_GET_TO": {
              caption: "dist",
              thickness: "count"
          }
      },
      initial_cypher: "MATCH p=(:City)-[:CAN_GET_TO]->(:City) RETURN p"
    }
    this.viz = new NeoVis.default(config);
    this.viz.render();
    this.viz.stabilize();
  };

  componentDidMount() {
    window.addEventListener('load', this.callInit);
    window.addEventListener('load', this.draw);
  }

  callInit = async () => {
    var response = await fetch('/init')
    var body = await response.json();
    this.state.cities = body;

    var firstbox = document.getElementById('first');
    var secondbox = document.getElementById('second');

    for(var i = 0; i < this.state.cities.length; i++){
      var option = this.state.cities[i];
      console.log(typeof this.state.cities[i]);
      firstbox.options.add(new Option(option, i) );
      secondbox.options.add(new Option(option, i) );
    }
  };

  searchThis = async () => {
    const response = await fetch('/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        cities: {
            firstCity: this.state.firstCity,
            secondCity: this.state.secondCity
        }
      })
    });
    const body = await response.json();
    this.state.resultDist = "Кратчайшее расстояние: " + body + " км";
    this.forceUpdate();
  };

  search(event) {
    this.state.firstCity = this.state.cities[document.getElementById("first").value]; 
    this.state.secondCity = this.state.cities[document.getElementById("second").value]; 

    this.searchThis();    
    this.forceUpdate();
  }

  addCity = async () => {
    const response = await fetch('/add_city', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: this.state.add
      })
    });
    this.callInit();
    this.forceUpdate();
  }

  addText(event) {
    this.state.add = event.target.value;
    this.forceUpdate();
  }

  addRel = async () => {
    this.state.firstCity = this.state.cities[document.getElementById("first").value]; 
    this.state.secondCity = this.state.cities[document.getElementById("second").value]; 

    const response = await fetch('/add_rel', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        firstCity: this.state.firstCity,
        secondCity: this.state.secondCity,
        dist: this.state.addRel
      })
    });
  }

  addRelText(event) {
    this.state.addRel = event.target.value;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <div class="container">
          <div class="header clearfix">
            <nav>
              <ul class="nav nav-pills float-right">
                <li class="nav-item">
                  <a class="nav-link active" href="#">Поиск <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">РПЗ </a>
                </li>
                <li class="nav-item">
                  <p><a class="nav-link" href="#bot">Вниз</a></p>
                </li>
              </ul>
            </nav>
            <h3 class="text-muted">Курсовой проект по базам данных</h3>
          </div>

          <div id="viz" class="jumbotron jumbotron-fluid">
          </div>

          <div class="row marketing">
            <div class="col-lg-3">
              <h5>Добавить город: </h5>
              <br /><input type="text" id="addCity" onChange={this.addText.bind(this)} placeholder="Название города"/>
              <br /><br /><button onClick={this.addCity.bind()}>Добавить город</button>
            </div>

            <div class="col-lg-6">
              <h5>Поиск кратчайшего расстояния: </h5>
              <br /><p> Из города </p> <select id="first"></select> <p> в город </p> <select id="second"></select>
              <br /><br /><button onClick={this.search.bind(this)}>Поиск</button>
              <br /><br /><p>{this.state.resultDist}</p><br /><br /><a name="bot"></a>
            </div>

            <div class="col-lg-3">
              <h5>Добавить связь: </h5>
              <br /><input type="text" id="addRel" onChange={this.addRelText.bind(this)} placeholder="Расстояние в км"/>
              <br /><br /><button onClick={this.addRel.bind()}>Добавить связь</button>
            </div>
        
          </div>

          <footer class="footer">
            <div class="container">
              <span class="text-muted">Квасников Александр, 2019</span>
            </div>
          </footer>
        </div>
       </div>
    );
  }
}

export default App;