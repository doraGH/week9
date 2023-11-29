// 請代入自己的網址路徑
const api_path = "dorayu";
const token = "cJIYbqeVkPTQ8NKEr6OaqcWrcWI3";

// 步驟一：初始化，取得產品與購物車列表
// 取得產品列表
let data = [];
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(response =>{
      data = response.data.products;
      console.log(data);
      render(data);
    })
    .catch(error =>{
      console.log(error.response.data);
    })
}
getProductList();

function render(data) {
  const productWrap = document.querySelector(".productWrap");
  let str = "";
  data.forEach(item=> {
    str += `
      <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(item.price)}</p>
      </li>
    `;
  });
  productWrap.innerHTML = str;
}

// 千分位加逗點
function toThousands(num) {
  let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
  let result = num.toString().replace(comma, ',');  
  // 去除小數點
  result = result.replace(/\.\d+$/, '');
  return result;
}


// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,)
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error.response.data);
    })
}
// getCartList();

// 步驟二：新增購物車品項，並再次初始化購物車列表
// 加入購物車
function addCartItem() {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
    "data": {
      "productId": "yHhhxNOxE04gMLMs8Mqq",
      "quantity": 2
    }
  })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error.response.data);
    })
}
// addCartItem()

// 步驟三：修改購物車狀態(刪除全部、刪除單筆)，並再次初始化購物車列表
// 刪除全部購物車
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error.response.data);
    })
}
// deleteAllCartList()

// 刪除購物車內特定產品(代入購物車的id)
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      consoloe.log(error.response.data);
    })
}
// deleteCartItem("dfO6ALhsQeAZJa3iWGA7");

// 步驟四：送出購買訂單，並再次初始化購物車列表
// 送出購買訂單
function createOrder() {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
    "data": {
      "user": {
        "name": "六角學院",
        "tel": "07-5313506",
        "email": "hexschool@hexschool.com",
        "address": "高雄市六角學院路",
        "payment": "Apple Pay"
      }
    }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error =>{
    console.log(error.response.data);
  })
}
// createOrder()

// 步驟五：觀看後台訂單
// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
    headers: {
      'Authorization': token
    }
  })
  .then(function (response) {
    console.log(response.data);
  })
}

