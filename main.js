
const wood = {
    id: '#wood',
    name: 'wood',
    count: 0,
    mult: 1,
}
const stone = {
    id: '#stone',
    name: 'stone',
    count: 0,
    mult: 1,
}

class ProductionBuilding {
    constructor(name, resource, costs) {
        this.name = name;
        this.resource = resource;
        this.costs = costs;
        this.type = 'producer';
        this.level = 0; // could be quantity/count/total/number depending on goals and/or perception
        this.speed = 5000;
        this.baseYield = 1;
    }

    getProduction() {
        return level * this.baseYield;
    }
    getCostStr() {
        let str = '';
        for (let i = 0; i < this.costs.length; i++) {
            str += `${this.costs[i].resource.name}: ${this.costs[i].cost} `
        }
        str = str.trim();
        return str;
    }

    levelUp() {
        for (let i = 0; i < this.costs.length; i++) {
            const resCount = this.costs[i].resource.count;
            const resCost = this.costs[i].cost;
            if (resCost > resCount) {
                return;
            }
        }
        for (let i = 0; i < this.costs.length; i++) {
            this.costs[i].resource.count -= this.costs[i].cost;
            this.costs[i].cost += 15; // just a way to increase the cost after each purchase
        }
        this.level++;
        if (this.level % 5 === 0 && this.speed > 1000) {
            this.speed -= 500;
        }
        updateScreen()
    }
}

const forest = new ProductionBuilding('forest', wood, [{ resource: wood, cost: 0 }]);
const mine = new ProductionBuilding('mine', stone, [{ resource: wood, cost: 0 }, { resource: stone, cost: 0 }]);



function updateScreen() {
    document.querySelector('#wood').innerText = `Wood: ${wood.count}`;
    document.querySelector('#stone').innerText = `Stone: ${stone.count}`;
    document.querySelector('#forest').innerText = `Forest level: ${forest.level}`;
    document.querySelector('#mine').innerText = `Mine level: ${mine.level}`;
    document.querySelector('#forestCost').innerText = forest.getCostStr();
    document.querySelector('#mineCost').innerText = mine.getCostStr();
}


updateScreen();
window.setInterval(function() {
    if (forest.level > 0) {
        
    }
    updateScreen();
}, 1000)





// const timers = [];

// function addTimer(id, duration, callback) {
//     const timer = {
//         id: id,
//         diration: duration,
//         remaining: duration,
//         callback: callback,
//     };
//     timers.push(timer);
// }

// function startTimers() {
//     const interval = 1000
//     setInterval(() => {
//         timers.forEach(timer => {
//             timer.remaining -= interval;
//             if (timer.remaining <= 0){
//                 timer.callback();
//                 timer.remaining = timer.duation;
//             }
//         });
//     }, interval);
// }

