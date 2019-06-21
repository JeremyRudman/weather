import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Header} from './Header.js'

class Location extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submit: false,
            location: '',
            type: '°F',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    onSetTempType(type) {
        this.setState({
            type: type
        })
    }

    handleChange(event) {
        this.setState({location: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({submit: true});
    }

    render() {
        if (this.state.submit === false) {
            return (
                <div>
                    <Header type={this.state.type} changeType={this.onSetTempType.bind(this)}/>
                    <div className="Main">

                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Please enter your location: <input type="text" value={this.state.location}
                                                                   onChange={this.handleChange}/>
                            </label>
                            <input type="submit" value="Submit"/>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <Header type={this.state.type} changeType={this.onSetTempType.bind(this)}/>
                    <Weather userLoc={this.state.location} type={this.state.type}/>
                </div>
            )
        }
    }
}

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loc: '',
            type: '',
            temp: [],
            weather: [],
        };

    }

    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type) {
            this.setState({type: this.props.type})
        }
    }

    async componentDidMount() {
        this.setState({loc: this.props.userLoc});
        this.setState({type: this.props.type});
        await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + this.props.userLoc + '&APPID=789a3dc024444d52236fdd13e641da8c')
            .then(responce => responce.json()
            )
            .then(data => {
                console.log(data);
                console.log(data.cod);
                if(data.cod==="404"){
                    window.location.reload();
                    alert("Not a valid location");
                }
                this.setState({temp: data.main});
                this.setState({weather: data.weather[0]});
            }).catch((error)=>{
                console.log(error);
            });

    }

    render() {
        let max = this.state.temp.temp_max;
        let temp = this.state.temp.temp;
        let min = this.state.temp.temp_min;
        let sky = this.state.weather.description;
        if (this.state.type === '°F') {
            max = parseInt((max - 273.15) * (9 / 5) + 32.5);
            temp = parseInt((temp - 273.15) * (9 / 5) + 32.5);
            min = parseInt((min - 273.15) * (9 / 5) + 32.5);
        } else {
            max = parseInt((max - 273.15) + .5);
            temp = parseInt((temp - 273.15) + .5);
            min = parseInt((min - 273.15) + .5);
        }

        return (
            <div className="Main">
                <div> It is currently {temp}{this.state.type} with {sky} in {this.state.loc}, expected high
                    of {max}{this.state.type} and a low
                    of {min}{this.state.type}
                </div>
            </div>
        );
    }


}

ReactDOM.render(
    <Location/>,
    document.getElementById('root')
);