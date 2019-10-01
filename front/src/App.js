import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import './App.css';
import * as ReactDOM from 'react-dom';
import style from 'bootstrap/dist/css/bootstrap.css';
import * as NeoVis from 'neovis.js/dist/neovis.js';
import $ from 'jquery';
import { pdfjs } from 'react-pdf';
import file from './RPZ.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
      config: [],
      numPages: null,
      pageNumber: 1,
    };
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));

  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

  changeToRPZ(event) {
    document.getElementById("viz").style.display = "none";
    document.getElementById("rpz").style.display = "block";
  }

  changeToGraph(event) {
    document.getElementById("rpz").style.display = "none";
    document.getElementById("viz").style.display = "block";
  }

  draw = async () =>  {
    var cw = $('#viz').width();
    $('#viz').css({'height':cw+'px'});
    this.config = {
      container_id: "viz",
      server_url: "bolt://5.23.52.228:7687",
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
    this.viz = new NeoVis.default(this.config);
    this.viz.render();
    //this.viz.stabilize();
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
    const pageNumber = this.state.pageNumber;
    const numPages = this.state.numPages;
    return (
      <div className="App">

        <div class="container">
          <div class="header">
            <nav>
              <ul class="nav nav-pills float-right">
                <li class="nav-item">
                  <button id="navbut" onClick={this.changeToGraph.bind()}>Граф</button>
                </li>
                <li class="nav-item">
                  <button id="navbut" onClick={this.changeToRPZ.bind()}>РПЗ</button>
                </li>
              </ul>
            </nav>
            <h3 class="text-muted">Курсовой проект по базам данных</h3>
          </div>
          <br/>
          <div class="row">
            <div id="switch" class="col-lg-8"> 
              <div id="viz"></div>
              <div id="rpz"><br/>
                <nav>
                  <div>
                    <button id="pdfbut" onClick={this.goToPrevPage}>Назад</button><button id="pdfbut" onClick={this.goToNextPage}>Вперед</button>
                    <Document id="center" file={file} onLoadSuccess={this.onDocumentLoadSuccess} onLoadError={console.error}>
                      <Page pageNumber={pageNumber} width={575} />
                    </Document>
                  </div>
                </nav>
              </div>
            </div>   

            <div class="col-lg-4">
              <br /><h3>Добавить город: </h3>
              <br /><input type="text" id="addCity" onChange={this.addText.bind(this)} placeholder="Название города"/>
              <br /><br /><button id="navbut" onClick={this.addCity.bind()}>Добавить город</button><br />
              <hr></hr>
              <h3>Кратчайшее расстояние: </h3>
              <br /><p> Из </p> <select id="first"></select> <p> в </p> <select id="second"></select>
              <br /><br /><button id="navbut" onClick={this.search.bind(this)}>Поиск</button>
              <br /><br /><p>{this.state.resultDist}</p>
              <hr></hr>
              <h3>Добавить связь: </h3>
              <br /><input type="text" id="addRel" onChange={this.addRelText.bind(this)} placeholder="Расстояние в км"/>
              <br /><br /><button id="navbut" onClick={this.addRel.bind()}>Добавить связь</button>
            </div>
          </div>
        </div>
       </div>
    );
  }
}

export default App;