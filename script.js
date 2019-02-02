$(document).ready(() => {
    const cryptoCard = `<div class="card">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
     <button class="btn btn-primary"> More info</button> 
    </div>
    <div class="toggle-card"> 
    <label class="switch">
  <input type="checkbox">
  <span class="slider round"></span>
  </label>
  </div>
  </div>`;
    $(".card-list").append(cryptoCard);
}
)