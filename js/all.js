const api_path = "dorayu";
const apiUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/`
const token = "cJIYbqeVkPTQ8NKEr6OaqcWrcWI3";
let data = [];  // 產品列表
let cartData = [];  // 購物車列表



// 初始化
function init() {
  getProductList(); //產品列表
  getCartList(); // 購物車列表
}
init();

// 步驟一：取得產品與購物車列表
// 取得產品列表
function getProductList() {
  const url = `${apiUrl}products`;
  axios.get(url)
    .then(response =>{
      data = response.data.products;
      renderProductList(data);
    })
    .catch(error =>{
      console.log(error.response.data.message);
    })
}

// 渲染產品列表
const productWrap = document.querySelector(".productWrap");
function renderProductList(data) {  
  let str = "";
  data.forEach(item=> {
    str += `
      <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCartBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(item.price)}</p>
      </li>
    `;
  });
  productWrap.innerHTML = str;
}

// 篩選產品下拉
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", filterProduct);

function filterProduct(e){
  let value = e.target.value;  // 當下value值
  let filterData = [];  // 篩出新陣列

  if(value === "全部") {
    filterData = data;
  } else {
    filterData = data.filter(item => {
      return item.category === value;
    })
  }
  renderProductList(filterData);  // 渲染畫面
}

// 取得購物車列表
function getCartList() {
  const url = `${apiUrl}carts`;
  axios.get(url)
    .then(response => {
      cartData =response.data.carts;

      // 取得購物車總金額
      const totalCartPrice = document.querySelector(".totalCartPrice");
      totalCartPrice.textContent = toThousands(response.data.finalTotal);
      
      renderCartList();
    })
    .catch(error => {
      console.log(error.response.data.message);
    })
}

// 渲染購物車列表
const shoppingCartBbody = document.querySelector(".shoppingCart-tbody");
function renderCartList(){
  let str = "";
  cartData.forEach(item => { 
    str +=`
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="https://i.imgur.com/HvT3zlU.png" alt="">
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${toThousands(item.product.price)}</td>
      <td>${item.quantity}</td>
      <td>NT$${toThousands(item.product.price * item.quantity)}</td>
      <td class="discardBtn">
        <a href="#" data-id=${item.id} class="material-icons">
          clear
        </a>
      </td>
    </tr>
    `;
  });
  shoppingCartBbody.innerHTML = str;
}

// 步驟二：新增購物車品項，並再次初始化購物車列表
// 點擊加入購物車
productWrap.addEventListener("click", addCart);
function addCart(e) {
  e.preventDefault();
  const addCartClass = e.target.getAttribute("class");
  if(addCartClass !== "addCartBtn") return;
  const productId = e.target.dataset.id;
  addCartItem(productId);
}

// 加入購物車
function addCartItem(id) {  
  let quantity = 1; // 預設1筆
  cartData.forEach(item => {
    if(item.product.id === id) { // 如果購物產品id 等於 當下點擊加入購物車的id
      quantity = item.quantity +=1;  // 購物車現有品名數量+1
    };
  });

  const url = `${apiUrl}carts`;
  const data = {
    "data": {
      "productId": id,
      "quantity": quantity
    }
  };
  axios.post(url,data)
    .then(response => {
      sweetAlert("成功加入購物車!");  // 過場動態
      getCartList(); // 重新渲染購物車
    })
    .catch(error => {
      console.log(error.response.data);
    })
}

// 步驟三：修改購物車狀態(刪除全部、刪除單筆)，並再次初始化購物車列表
// 刪除全部購物車
function deleteAllCartList() {
  const url = `${apiUrl}carts`;
  axios.delete(url)
    .then(response => {      
      sweetAlert("成功刪除購物車!");  // 過場動態
      getCartList();
    })
    .catch(error => {
      console.log(error.response.data);
    })
}
// 點擊全部刪除
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) =>{
  e.preventDefault();  
  deleteAllCartList();  
});

// 刪除購物車內特定產品(代入購物車的id)
function deleteCartItem(id) {
  const url = `${apiUrl}carts/${id}`;
  axios.delete(url)
    .then(response => {      
      sweetAlert("成功刪除一筆購物車!");  // 過場動態
      getCartList(); // 重新渲染購物車
    })
    .catch(error => {
      consoloe.log(error.response.data);
    })
}

// 監聽購物車列表
shoppingCartBbody.addEventListener("click", deleteSingleCart);
function deleteSingleCart(e) {
  e.preventDefault();
  const deleteBtnClass = e.target.getAttribute("class");
  if(deleteBtnClass !== "material-icons") return;
  const cartId = e.target.dataset.id;    
  deleteCartItem(cartId);   
}

// 步驟四：送出購買訂單，並再次初始化購物車列表
// 送出購買訂單
function createOrder() {
  const url = `${apiUrl}orders`;
  const data = {
    "data": {
      "user": {
        "name": "六角學院",
        "tel": "07-5313506",
        "email": "hexschool@hexschool.com",
        "address": "高雄市六角學院路",
        "payment": "Apple Pay"
      }
    }
  };
  axios.post(url, data)
  .then(response => {
    console.log(response.data);
  })
  .catch(error =>{
    console.log(error.response.data);
  })
}

// 加入訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", addOrder);
function addOrder(e){
  e.preventDefault();
  if(cartData.length === 0) {
    sweetError("您的購物車是空的!");
    return;
  } else {
    sweetAlert("OK");
  }

  
  // const orderInfoForm = document.querySelector(".orderInfo-form");
  // const orderFormGroup = document.querySelectorAll(".orderInfo-formGroup");

  // orderFormGroup.forEach(item => {
  //   const inputs = document.querySelectorAll("input[name], select[name]");
  //   inputs.forEach(item => {
  //     item.addEventListener("change", function(){
  //       console.log(item);
  //     });
  //   });
  // });

}




// 步驟五：觀看後台訂單
// 取得訂單列表
// function getOrderList() {
//   axios.get(`${apiUrl}orders`, {
//     headers: {
//       'Authorization': token
//     }
//   })
//   .then(function (response) {
//     console.log(response.data);
//   })
// }

// 千分位加逗點
function toThousands(num) {
  let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
  let result = num.toString().replace(comma, ',');  
  // 去除小數點
  result = result.replace(/\.\d+$/, '');
  return result;
}

// 過場動態
function sweetAlert(txt){
  Swal.fire({
    position: "center",    
    icon: "success",
    title: txt,
    showConfirmButton: false,
    timer: 1500,
    color: "#ffffff",
    background: "#716add",
  }); 
}
function sweetError(txt){
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: txt,
    color: "#ffffff",
    background: "#716add",
  });
}

