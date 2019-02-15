let objCrypto = {};
let favoritesCoin = [];

function backup() {
    if (localStorage.getItem("objCrypto") !== null) {
        objCrypto = JSON.parse(localStorage.getItem("objCrypto"));
        console.log(objCrypto);    //for check
    }
}
function saveObjCrypto() {
    localStorage.setItem('objCrypto', JSON.stringify(objCrypto));
}

function toggleOff(event) {
    $(event.target).prop('checked',false)
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

    $(".nav-about").on("click", () => {
        console.log("about"); //for check
        updateProgressBar("100");
        $.ajax({
            type: "get",
            url: "about.html",
            success: (response) => {
                setTimeout(() => { updateProgressBar("0") }, 500);
                $(".card-list").empty();
                $(".card-list").append(response);
            },
            error: (error) => {
                alert("The page does not exist");
                console.log(JSON.stringify(error.status));
            }
        });
    })

    $(".nav-home").on("click", () => {
        console.log("about"); //for check
        updateProgressBar("100");
        $.ajax({
            type: "get",
            url: "index.html",
            success: (response) => {
                console.log(response);
                setTimeout(() => { updateProgressBar("0") }, 500);
                $(".card-list").empty();
                $(".card-list").append(coinList());
            },
            error: (error) => {
                alert("The page does not exist");
                console.log(JSON.stringify(error.status));
            }
        });
    })

    $("body").on("click", ".modal-content .save-changes", (event) => {
        const toggleList = $('.modal-body input[type="checkbox"]').filter((key,value) => {
            return ($(value).prop('checked') === false);
        });

        for(let index = 0; index < toggleList.length; index++ ) {
            // 1. update toggle array
            const coinId = toggleList[index].dataset.id;
            const i = favoritesCoin.indexOf(coinId);
            favoritesCoin.splice(i, 1);
            // 2. update dom toggles
            $(`.card-list .toggle-card input[type="checkbox"][data-id="${coinId}"]`).prop('checked',false);
            // 3. close modal
            $('#favoritModal').modal('hide');

        }

    });

    $("body").on("click", ".card-list input[type='checkbox']", (event) => {
        let Checkbox = event.target;
        const coinId = Checkbox.dataset.id;
        const isModalOpen = $('#favoritModal').hasClass('show');

        // if the number of favorite coins is  < 5
        // add coin id to favorite.
        if (favoritesCoin.length < 5) {
            favoritesCoin.push(coinId);
        } else {
            toggleOff(event);
            if (isModalOpen) return;

            // append all coins & toggles to modal
            $('.modal-body').html(
                favoritesCoin.map(item => {
                    return(
                        `<div class="line-item">
                            <div>${item}</div>
                            <div class="toggle-card">
                                <label class="switch">
                                    <input type="checkbox" data-id=${item} checked>
                                        <span class="slider round"></span>
                                </label>
                            </div>
                        </div>`
                    );
                })
            )
            // open modal and ask user to un-check one of the other toggles
            $('#favoritModal').modal('show');
        }
    })

})  //end $(document).ready

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
            console.log(response.slice(0, 10)); //for check
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
            <input type="checkbox" data-id=${cryptoData.id}>
            <span class="slider round"></span>
            </label>
            </div>
            </div>
            </div>`);
}

function createObj(response) {
    return ({
        image: response.image.small,
        currentUsd: response.market_data.current_price.usd,
        currentEur: response.market_data.current_price.eur,
        currentIls: response.market_data.current_price.ils,
        timeCreate: new Date().getTime()
    });
}

function getCoinDetails(coinId) {
    if (callAjax(coinId)) {
        updateProgressBar("100");
        $.ajax({
            type: "get",
            url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
            success: (response) => {
                setTimeout(() => { updateProgressBar("0") }, 500);
                objCrypto[coinId] = (createObj(response));
                saveObjCrypto();
                console.log(objCrypto[coinId]);   ////for check
                showMoreInfo(coinId);
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
// function graphFavoritesCoin(coinId){

// }


