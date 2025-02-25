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
        this.baseYield = 1;
        this.timer = {
            duration: 1,
            interval: 0,
            remaining: 0,
            tickRate: 100,
        }
    }

    getProduction() {
        return this.level * this.baseYield;
    }
    getCostStr() {
        let costStr = 'Cost(s) - ';
        for (let i = 0; i < this.costs.length; i++) {
            const cost = toUpperCharAtZero(this.costs[i].resource.name);
            costStr += `${cost}: ${this.costs[i].cost} `
        }
        costStr = costStr.trim();
        return costStr;
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
        if (this.level === 0) {
            this.produce();
        }
        this.level++;
        if (this.level % 5 === 0 && this.timer.duration > 1) {
            this.timer.duration -= 0.5;
        }
        updateScreen();
    }
    produce() {
        const timer = this.timer;
        const start = () => {
            timer.remaining = timer.duration;
            timer.interval = setInterval(tick, timer.tickRate);
        }
        const tick = () => {
            if (timer.remaining - 0.1 <= 0) {
                this.resource.count += this.getProduction();
                clearInterval(timer.interval);
                start();
            }
            timer.remaining -= 0.1;

            const bar = document.querySelector(`#${this.name}Progress`);
            const progress = (timer.duration - timer.remaining) * 100 / timer.duration;
            const formattedTime = formatNum(timer.remaining);
            bar.value = progress;
            // TODO migrate this down to updateScreen()
            // ? updateMe() method? Might be an easier way to manage/compartmentalize the various screen elements
            document.querySelector(`#${this.name}Time`).innerText = `${formattedTime}s`;
            document.querySelector(`#${this.name}Percentage`).innerText = `${progress.toFixed(1)}%`;
            
            updateScreen();
        }
        start();
    }
}

const forest = new ProductionBuilding('forest', wood, [{ resource: wood, cost: 0 }]);
const mine = new ProductionBuilding('mine', stone, [{ resource: wood, cost: 0 }, { resource: stone, cost: 0 }]);

function updateScreen() {
    document.querySelector('#wood').innerText = `Wood: ${wood.count}`;
    document.querySelector('#stone').innerText = `Stone: ${stone.count}`;

    document.querySelector('#forest').innerText = `Forest level: ${forest.level}`;
    document.querySelector('#forestProgress').value = (forest.timer.duration - forest.timer.remaining) * 100 / forest.timer.duration;
    document.querySelector('#forestProgress').innerText = `${formatNum(forest.timer.remaining)}s`;
    document.querySelector('#forestCost').innerText = forest.getCostStr();

    document.querySelector('#mine').innerText = `Mine level: ${mine.level}`;
    document.querySelector('#mineProgress').value = (mine.timer.duration - mine.timer.remaining) * 100 / mine.timer.duration;
    document.querySelector('#mineProgress').innerText = `${formatNum(mine.timer.remaining)}s`;
    document.querySelector('#mineCost').innerText = mine.getCostStr();
}

function formatNum(num) { // will return a string, so good for displaying on screen but can cause math bugs
    return num.toFixed(1);
}

function toUpperCharAtZero(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

updateScreen();
window.setInterval(function() {
    updateScreen();
}, 1000)