const objCrypto = {};
let cryptoData = [];

function backup() {
    if (localStorage.getItem("obj") !== null) {
        objCrypto = JSON.parse(localStorage.getItem("objCrypto"));
        console.log(objCrypto);    //for check
    }
}

$(document).ready(() => {
    backup();
    coinList();

    $(".progress-bar").append(
        `<div class="progress">
                 <div class="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
         </div>`);

    $("body").on("click", ".more-info-coin", (event) => {
        debugger;
        const coinId = event.target.dataset.id;
        getCoinDetails(coinId);
    })
}
)

function coinList() {
    $.ajax({
        type: "get",
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (response) => {
            cryptoData = response.slice(0, 10);
            console.log(response.slice(0, 10));
            // console.log(this.cryptoData);
            for (let i = 0; i < 10; i++) {
                coinView(i);
            }
        },
        error: (error) => {
            console.log(JSON.stringify(error.status));
        }
    });
}

function coinView(i) {
    $(".card-list").append(`<div class="col"> 
            <div class="card">
            <div class="card-body">
            <h5 class="card-title">${cryptoData[i].symbol}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${cryptoData[i].name}</h6>

            <button class="btn btn-primary more-info-coin" type="button" data-toggle="collapse" 
                data-id=${cryptoData[i].id}
                data-target=#crypto_${cryptoData[i].id}
                aria-expanded="false" aria-controls=crypto_${cryptoData[i].id}>
                More info
            </button>

            <div class="collapse" id=crypto_${cryptoData[i].id}>
            <div class="card card-body" >
          
            </div>
            </div>

            </div>
            <div class="toggle-card"> 
            <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
            </label>
            </div>
            </div>
            </div>`);
}

function getCoinDetails(coinId) {
    $.ajax({
        type: "get",
        url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
        success: (response) => {
            $(`#crypto_${coinId}`).html(`<img src=${response.image.small}/> <br/> 
             <div> ${((response.market_data.current_price.usd).toFixed(5))}$ </div><br/> 
             <div> ${((response.market_data.current_price.eur).toFixed(5))}€ </div><br/> 
             <div> ${((response.market_data.current_price.ils).toFixed(5))}₪ </div>`);
            console.log(response.image.small);  ////for check
        },
        error: (error) => {
            console.log(JSON.stringify(error.status));
        }
    });
}


