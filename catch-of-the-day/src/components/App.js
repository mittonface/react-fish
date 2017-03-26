import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish'
import base from '../base';

class App extends React.Component {
    constructor() {
        super();

        this.addFish = this.addFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);

        this.state = {
            fishes: {},
            order: {}
        };
    }

    componentWillMount(){
        // this runs right before App is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
            context: this,
            state: 'fishes',
        });


        // check to see if there is anything in local storage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)

        if (localStorageRef){
            // update our App component order state
            this.setState({
                order: JSON.parse(localStorageRef),
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));

    }


    loadSamples(){
       this.setState({
           fishes: sampleFishes
       });
    }

    addToOrder(key){
        // take a copy
        const order = {...this.state.order};
        // update or add
        order[key] = order[key] + 1 || 1;
        this.setState({order});
    }

    addFish(fish){
        // update our state
        const fishes = {...this.state.fishes};
        // add in our new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // set state
        this.setState({fishes});
    }

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes});
    }

    removeFish(key){
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({fishes});
    }

    render () {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
                        }
                    </ul>
                </div>
                <Order params={this.props.params} fishes={this.state.fishes} order={this.state.order} />
                <Inventory
                    updateFish={this.updateFish}
                    fishes={this.state.fishes}
                    loadSamples={this.loadSamples}
                    addFish={this.addFish}
                    removeFish={this.removeFish}
                />
            </div>
        );
    }
}

export default App;