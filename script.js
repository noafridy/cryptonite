$(document).ready(() => {
    $("body").on("click", ".more-info-coin", (event) => {
        debugger;
        const coinId = event.target.dataset.id;
        cryptoAdapterInst.getCoinDetails(coinId);
    })
}
)

class cryptoAdapter {
    constructor() {
        this.cryptoData = [];
    }
    get CryptoData() {
        return this.cryptoData;
    }

    coinList() {
        $.ajax({
            type: "get",
            url: "https://api.coingecko.com/api/v3/coins/list",
            success: (response) => {
                debugger;
                this.cryptoData = response.slice(0, 10);
                console.log(response.slice(0, 10));
                // console.log(this.cryptoData);
                for (let i = 0; i < 10; i++) {
                    this.coinView(i);
                }
            },
            error: (error) => {
                console.log(JSON.stringify(error.status));
            }
        });
    }
    coinView(i) {
        $(".card-list").append(`<div class="card">
                <div class="card-body">
                <h5 class="card-title">${this.cryptoData[i].symbol}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${this.cryptoData[i].name}</h6>


                <button class="btn btn-primary more-info-coin" type="button" data-toggle="collapse" 
                    data-id=${this.cryptoData[i].id}
                    data-target=#crypto_${this.cryptoData[i].id}
                    aria-expanded="false" aria-controls=crypto_${this.cryptoData[i].id}>
                    More info
                </button>

                <div class="collapse" id=crypto_${this.cryptoData[i].id}>
                <div class="card card-body">
              
                </div>
                </div>

                </div>
                <div class="toggle-card"> 
                <label class="switch">
                <input type="checkbox">
                <span class="slider round"></span>
                </label>
                </div>
                </div>`);
        // $(".card-list").append(`<div> ${this.cryptoData[i].symbol} ${this.cryptoData[i].name}</div> `);
        // $(".card-list").append(`<div class="card">
        // <div class="card-body">
        // <h5 class="card-title">${this.cryptoData[i].symbol}</h5>
        // <h6 class="card-subtitle mb-2 text-muted">${this.cryptoData[i].name}</h6>


        // <button class="btn btn-primary" type="button" data-toggle="collapse" data-target=#crypto_${this.cryptoData[i].id}
        //     aria-expanded="false" aria-controls=crypto_${this.cryptoData[i].id}>
        //     More info
        // </button>

        // <div class="collapse" id=crypto_${this.cryptoData[i].id}>
        // <div class="card card-body">
        //   test1
        // </div>
        // </div>

        // </div>
        // <div class="toggle-card"> 
        // <label class="switch">
        // <input type="checkbox">
        // <span class="slider round"></span>
        // </label>
        // </div>
        // </div>`);
    }

    getCoinDetails(coinId) {
        $.ajax({
            type: "get",
            url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
            success: (response) => {
                // $(".card").append()
                console.log(response.name);
            },
            error: (error) => {
                console.log(JSON.stringify(error.status));
            }
        });
    }

}  //end class

//****************************************************** */
var cryptoAdapterInst = new cryptoAdapter();  //for check
cryptoAdapterInst.coinList();  //for check
