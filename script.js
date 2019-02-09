let objCrypto = {};

function backup() {
    if (localStorage.getItem("objCrypto") !== null) {
        objCrypto = JSON.parse(localStorage.getItem("objCrypto"));
        console.log(objCrypto);    //for check
    }
}
function saveObjCrypto() {
    localStorage.setItem('objCrypto', JSON.stringify(objCrypto));
}

$(document).ready(() => {

    backup();
    coinList();
    
    $("body").on("click", ".more-info-coin", (event) => {
        if ($(event.target).attr("aria-expanded") == "false") {
            const coinId = event.target.dataset.id;
            getCoinDetails(coinId);
        }
    })
}
)

function updateProgressBar(widthBar) {
    const $bar = $(".progress-bar.progress-bar-striped.progress-bar-animated");
    const $progress = $(".progress");
    if (widthBar === "0") {
        $progress.css("display", "none");
    }
    else {
        $progress.css("display", "flex");
    }
    $bar.css("width", `${widthBar}%`);
}

function coinList() {
    updateProgressBar("100");
    $.ajax({
        type: "get",
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (response) => {
            setTimeout(() => { updateProgressBar("0") }, 500);
            const cryptoData = response.slice(0, 10);
            console.log(response.slice(0, 10));
            // console.log(this.cryptoData);
            for (let i = 0; i < 10; i++) {
                coinView(cryptoData[i]);
            }
        },
        error: (error) => {
            console.log(JSON.stringify(error.status));
        }
    });
}

function coinView(cryptoData) {
    $(".card-list").append(`<div class="col"> 
            <div class="card">
            <div class="card-body">
            <h5 class="card-title">${cryptoData.symbol}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${cryptoData.name}</h6>

            <button class="btn btn-primary more-info-coin" type="button" data-toggle="collapse" 
                data-id=${cryptoData.id}
                data-target=#crypto_${cryptoData.id}
                aria-expanded="false" aria-controls=crypto_${cryptoData.id}>
                More info
            </button>

            <div class="collapse" id=crypto_${cryptoData.id}>
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
//const objCrypto = {};

function createObj(response) {
    return ({
        image: response.image.small,
        currentUsd: response.market_data.current_price.usd,
        currentEur: response.market_data.current_price.eur,
        currentIls: response.market_data.current_price.ils,
        timeCreate: new Date().getTime()
    });
}

function checkTime(timeStr) {
    const twoMin = 1000 * 60 * 2;
    return (new Date().getTime() - timeStr < twoMin) ? false : true;
}

function callAjax(coinId) {
    return (!objCrypto[coinId] || ((objCrypto[coinId]) && (checkTime(objCrypto[coinId].timeCreate))))
}

function showMoreInfo(coinId) {
    $(`#crypto_${coinId}`).html(`<img src=${objCrypto[coinId].image}/> <br/> 
    <div> ${((objCrypto[coinId].currentUsd).toFixed(5))}$ </div><br/> 
    <div> ${((objCrypto[coinId].currentEur).toFixed(5))}€ </div><br/> 
    <div> ${((objCrypto[coinId].currentIls).toFixed(5))}₪ </div>`);
}

function getCoinDetails(coinId) {
    if (callAjax(coinId)) {
        updateProgressBar("100");
        $.ajax({
            type: "get",
            url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
            success: (response) => {
                //updateProgressBar("100");
                setTimeout(() => { updateProgressBar("0") }, 500);
                objCrypto[coinId] = (createObj(response));
                saveObjCrypto();
                console.log(objCrypto[coinId]);   ////for check
                showMoreInfo(coinId);
                console.log(response.image.small);  ////for check

            },
            error: (error) => {
                updateProgressBar("100");
                setTimeout(() => { updateProgressBar("0") }, 500);
                console.log(JSON.stringify(error.status));
            }
        });
    }
    else {
        showMoreInfo(coinId);
    }

}



