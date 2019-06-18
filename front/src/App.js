import React, { Component } from 'react';
import './App.css';
import ReactDOM from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
      data: null,
      firstCity: "",
      secondCity: "",
      resultWay: "",
      resultDist: "",
    };
    
  }
  // componentDidMount() {
  //   this.callBackendAPI()
  //     .then(res => this.setState({ data: res.express }))
  //     .catch(err => console.log(err));
  // }
  // callBackendAPI = async () => {
  //   const response = await fetch('/backend');
  //   const body = await response.json();

  //   if (response.status !== 200) {
  //     throw Error(body.message) 
  //   }
  //   this.state.data = body;
  //   //console.log(this.data);
  //   return body;
  // };

  firstTextField(event) {
    this.state.firstCity = event.target.value;
    this.forceUpdate();
    //this.search(this);
  }
  secondTextField(event) {
    this.state.secondCity = event.target.value;
    this.forceUpdate();
    //this.search(this);
  }

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
    this.state.resultDist = "Result distance = " + body + " km";
    this.forceUpdate();
  };

  exist = async () => {
    const response = await fetch('/backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    this.state.data = body;
    //console.log(this.data);
    return body;
  };

  search(event) {
    // const response = await fetch('/backend'); {/* тут надо передать параметры (2 города) */}
    // const body = await response.json();

    // if (response.status !== 200) {
    //   throw Error(body.message) 
    // }

    // Тут мне нужно вернуть json с путем, и сконвертировать его в строку формата (город -(расстояние)-> город -...)

    // Возможно добавление кнопки "альтернативные варианты"
    // Если быстро сделаю, можно добавить поездом/самолетом, или типа того

    // Прежде всего необходимо реализовать алгоритм дейкстры, отправлять и парсить запрос + , получать и парсить ответ + ,
    // потом заполнить базу (разобраться с csv???). Сделать дизайн, возможно разобрарться с bootstrap?
    // Уже после этого можно попытаться добавить разделение на транспортные затраты или предпочтительный вид передвижения

    this.searchThis();    
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <input type="text" id="name1" onChange={this.firstTextField.bind(this)} />
        <input type="text" id="name2" onChange={this.secondTextField.bind(this)} />
        <button onClick={this.search.bind(this)}>search</button>
        <p className="App-intro">{this.state.firstCity} -> {this.state.secondCity}</p>
        <p className="App-intro">{this.state.resultWay}</p>
        <p className="App-intro">{this.state.resultDist}</p>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
      </div>

    );
  }
}

export default App;