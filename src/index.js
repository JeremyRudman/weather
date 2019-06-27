import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Header} from './Header.js'
import {Line} from 'react-chartjs-2';


class Location extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submit: false,
            location: '',
            type: '°F',
            lat: '',
            lon: '',
            geoLocate: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                geoLocate: true,
                submit: true,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            })
        })
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
                        <div>Please enter your city or ZIP code:
                            <form onSubmit={this.handleSubmit}>
                                <input type="text" value={this.state.location}
                                       onChange={this.handleChange}/>
                                <input type="submit" value="Submit"/>
                            </form>
                            &nbsp;or <button className="geo" onClick={this.getLocation.bind(this)}>Get current
                                location</button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <Header type={this.state.type} changeType={this.onSetTempType.bind(this)}/>
                    <Weather userLoc={this.state.location} type={this.state.type} geo={this.state.geoLocate}
                             lon={this.state.lon} lat={this.state.lat}/>
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
            lat: '',
            lon: '',
            geoLocate: false,
            weather: [],
            forcast: [],
            time: [],
        };

    }

    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type) {
            this.setState({type: this.props.type})
        }
    }

    async componentDidMount() {
        this.setState({type: this.props.type});
        this.setState({geoLocate: this.props.geo});
        var isnum = /^\d+$/.test(this.props.userLoc);
        console.log(isnum);
        var url = '';
        var forcastUrl = '';
        console.log(this.props.geo);
        if (this.props.geo) {
            url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + this.props.lat + '&lon=' + this.props.lon + '&APPID=789a3dc024444d52236fdd13e641da8c';
            forcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + this.props.lat + '&lon=' + this.props.lon + '&APPID=789a3dc024444d52236fdd13e641da8c'
        } else {
            if (isnum) {
                url = 'https://api.openweathermap.org/data/2.5/weather?zip=' + this.props.userLoc + ',us&APPID=789a3dc024444d52236fdd13e641da8c';
                forcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?zip=' + this.props.userLoc + ',us&APPID=789a3dc024444d52236fdd13e641da8c';
            } else {
                url = 'https://api.openweathermap.org/data/2.5/weather?q=' + this.props.userLoc + '&APPID=789a3dc024444d52236fdd13e641da8c';
                forcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + this.props.userLoc + '&APPID=789a3dc024444d52236fdd13e641da8c';
            }
        }
        await fetch(url)
            .then(responce => responce.json()
            )
            .then(data => {
                console.log('%c The location data', 'color:green;font-weight:bold;');
                console.log(data);
                console.log(data.cod);
                if (data.cod === "404" || data.message === "Nothing to geocode") {
                    window.location.reload();
                    alert(data.message);
                }
                console.log(data);
                this.setState({loc: data.name});
                this.setState({temp: data.main});
                this.setState({weather: data.weather[0]});
            }).catch((error) => {
                console.log(error);
            });
        await fetch(forcastUrl)
            .then(responce => responce.json()
            )
            .then(data => {
                console.log('%c The forecast data', 'color:green;font-weight:bold;');
                console.log(data);
                console.log(data.cod);
                if (data.cod === "404") {
                    window.location.reload();
                    alert(data.message);
                }
                var forcast = [40];
                var time = [40];
                console.log(time);
                for (let i = 0; i < 40; i++) {
                    var date = new Date(0);
                    date.setUTCSeconds(data.list[i].dt);
                    if (date.getHours() > 12) {
                        time[i] = (date.getHours() - 12) + 'pm';
                    } else {
                        time[i] = date.getHours() + 'am';
                    }
                }
                this.setState({time: time});
                for (let i = 0; i < 40; i++) {
                    forcast[i] = data.list[i].main.temp;
                }
                this.setState({forcast: forcast});
                console.log(time);
            }).catch((error) => {
                console.log(error);
            });

    }

    render() {
        let cast = this.state.forcast.slice();
        let max = this.state.temp.temp_max;
        let temp = this.state.temp.temp;
        let min = this.state.temp.temp_min;
        let sky = this.state.weather.description;
        let time = this.state.time;

        if (this.state.type === '°F') {
            for (let i = 0; i < 40; i++) {
                cast[i] = parseInt((cast[i] - 273.15) * (9 / 5) + 32.5);
            }
            max = parseInt((max - 273.15) * (9 / 5) + 32.5);
            temp = parseInt((temp - 273.15) * (9 / 5) + 32.5);
            min = parseInt((min - 273.15) * (9 / 5) + 32.5);
        } else {
            for (let i = 0; i < 40; i++) {
                cast[i] = parseInt((cast[i] - 273.15) + .5);
            }
            max = parseInt((max - 273.15) + .5);
            temp = parseInt((temp - 273.15) + .5);
            min = parseInt((min - 273.15) + .5);
        }

        var chartData = {
            labels: time,
            datasets: [{
                label: "Temperature",
                data: cast,
                backgroundColor: 'rgba(199,178,141,.7)',
                borderColor: 'rgba(199,178,141,1)'
            }],
        };

        var options = {
            legend: {
                display: false,
            },
            maintainAspectRatio: false,

        };
        return (
            <div className="Main">
                <div> It is currently {temp}{this.state.type} with {sky} in {this.state.loc}, expected a high
                    of {max}{this.state.type} and a low
                    of {min}{this.state.type}
                </div>
                <div className='chart'>
                    <Line data={chartData} height={500} options={options}/>
                </div>
            </div>
        )
    }


}

ReactDOM.render(
    <Location/>,
    document.getElementById('root')
);