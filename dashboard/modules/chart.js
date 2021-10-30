//require('chartjs-adapter-moment');

module.exports = {
    genChart(logs, option) {
        var xlbl = [], ylbl = [];

        if (option == 'playersonline'){
            var type = 'line', xtype = 'time', label = 'number of players', line = 2;
            logs.forEach(log => {
                if (log.online == false) ylbl.push(0);
                else ylbl.push(log.playersOnline);

                xlbl.push(log.timestamp);
            })
        }
        if (option == 'mostactive'){
            var type = 'line', xtype = 'time', label = 'uptime', line = 2;

            const numberofocc = {}, playerslist = [];

            // Get all the players recorded in the logs into a array
            logs.forEach(log => {
                if (log.playerNamesOnline) {
                    const players = log.playerNamesOnline.split(",");
                    playerslist.push(...players);
                }
            });

            if (playerslist.length == 0) {
                return '';
            }

            // Create a object with the number of times a player has been online
            playerslist.forEach(function(e) {
                if (numberofocc.hasOwnProperty(e)) numberofocc[e]++
                else numberofocc[e] = 1;
            })

            // Sort it by the value
            const sorted = Object.entries(numberofocc).sort(([c1, v1], [c2, v2]) => { return v2 - v1 }).reduce((o, [k, v]) => (o[k] = v, o), {});
            const arr = Object.entries(sorted);

            arr.forEach(element => {
                xlbl.push(element[0]);
                ylbl.push(element[1] * 5);
            });
        }
        if (option == 'uptime'){
            var type = 'bar', label = 'number of minutes played', line = 1;
            var up = 0, down = 0;
            logs.forEach(log => {
                if (log.online == true) {
                    up++
                    ylbl.push(1);
                } else {
                    down++
                    ylbl.push(0);
                }
                xlbl.push(log.timestamp);
            })
        }
        
        return {
            type,
            data: {
                labels: xlbl,
                datasets: [{
                    label,
                    data: ylbl,
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 0.8)',
                    borderWidth: line,
                    steppedLine: true
                }]
            },
            options: {
                responsive: true,
                elements: {
                    point: {
                        radius: 0
                    }
                },
                legend: {
                    labels: {
                        fontColor: "rgb(247, 247, 247)",
                        fontSize: 15
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "rgb(247, 247, 247)",
                            fontSize: 15,
                            stepSize: 1,
                            callback: function(value) {
                                if (args == 'uptime') {
                                    if (value == 1) return 'online';
                                    if (value == 0) return 'offline';
                                } else return value;
                            }
                        }
                    }],
                    xAxes: [{
                        type: xtype,
                        time: {
                            unit: 'year'
                        },
                        ticks: {
                            fontColor: "rgb(247, 247, 247)",
                            fontSize: 13,
                            stepSize: 1
                        }
                    }]
                }
            }
        }
    }
}