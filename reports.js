//graph options
// ETH,  BTC, ******> ZCN, RTB ,btcl
var chart;
var interavalPointer = null;

var options = {
    exportEnabled: true,
    animationEnabled: false,
    title: {
        text: "Favorites coins comparison"
    },
    axisX: {
        title: "Time[Sec]",
        valueFormatString: "HH:mm:ss"
    },
    axisY: {
        title: "Coin Value[USD]",
        titleFontColor: "#4F81BC",
        lineColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        tickColor: "#4F81BC",
        includeZero: false
    },
    toolTip: {
        shared: true
    },
    legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries
    },
    data: []
};

$(".app-header").on("click", () => {
    stopFunGetRealTimeData2Sec();
});

function stopFunGetRealTimeData2Sec() {
    if (interavalPointer != null){
    clearInterval(interavalPointer);
    }
  }



function createSymbolArray() {
    let symbolArr = [];
    favoritesCoin.map(coinId => {
        symbolArr.push(cryptoData.filter((val,key) => {return val.id === coinId})[0].symbol.toUpperCase());
    });
    return symbolArr;
}

function createGraph() {
    const symbolArr = createSymbolArray();
    createOptionsData(symbolArr);
    getRealTimeData2Sec(symbolArr);
}

// create the data section in options
function createOptionsData(coinIds) {
    coinIds.map(function(coinId) {
        options.data.push({
            type: "spline",
            name: coinId,
            showInLegend: true,
            interval: 4,
            intervalType: "minute",
            xValueFormatString: "HH:mm:ss",
            dataPoints: []
        });
    });

    chart = new CanvasJS.Chart("chartContainer", options);
}

// function to bring data each 2 seconds
function getRealTimeData2Sec(coinIds) {
    getRealTimeData(coinIds);
    interavalPointer = setInterval(() => {
        getRealTimeData(coinIds)
    }, 2000);
}

// funciton to bring compared data
// coinIds = string of coin ids: <coinid>,<coinid>....<coinid>
function getRealTimeData(coinIds) {
    $.ajax({
        type: "get",
        url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinIds.join()}&tsyms=USD`,
        success: (response) => {
            if (response.Response === 'Error') {
                stopFunGetRealTimeData2Sec();
                alert("There is no data for the selected coins");
                return;
            }          
            Object.keys(response).map(key => {
                addDataPoint(key, response[key].USD);
            });
            chart.render();
            // $("#chartContainer").CanvasJSChart(options);
        },
        error: (error) => {
            alert("something went wrong");
        }
    });
}

function addDataPoint(coinId, valueUSD) {
    const currectTime = new Date();

    options.data.map(item => {
        if (item.name === coinId) {
            item.dataPoints.push({ x: currectTime, y: valueUSD });
        }

        if (item.dataPoints.length > 8 ) {
            item.dataPoints.shift();
        }
    });

    
}



function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

// createGraph();

