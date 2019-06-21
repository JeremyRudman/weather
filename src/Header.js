import React from 'react';

import './Header.css'


export class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = { type: '°F' };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(type) {
        if(this.state.type==='°F'){
            this.setState({type:'°C'});
            this.props.changeType('°C');
        }
        else{
            this.setState({type:'°F'});
            this.props.changeType('°F');
        }
    }

    handleHome(e){
        window.location.reload();
    }

    render() {
        return(
            <div id="Header">
                <input type="button" className="Home" value="Home" onClick={this.handleHome}/>
                <div className="Type">
                    <input type="button" className="onType" value={this.state.type} onClick={this.handleClick}/>
                </div>
            </div>

        )

    }
}