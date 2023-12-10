const api_path = "dorayu";
const apiUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/`;
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
      getCategories();
    })
    .catch(error =>{
      sweetError(error.response.data.message);
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

// 取得下拉選項元素
function getCategories() {
  let usSort = data.map(item => item.category);
  let sorted = usSort.filter((item,i) => usSort.indexOf(item) === i);
  renderCategories(sorted); // 呼叫渲染函式
}

// 渲染下拉資料
function renderCategories(sorted){
  let str = `<option value="全部" selected>全部</option>`;
  sorted.forEach(item => {
    str += `<option value="${item}">${item}</option>`;
  });
  productSelect.innerHTML = str;
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
      
      renderCartList(cartData);
    })
    .catch(error => {
      sweetError(error.response.data.message);
    })
}

// 渲染購物車列表
const shoppingCartBody = document.querySelector(".shoppingCart-tbody");
function renderCartList(mydata){
  let str = "";
  mydata.forEach(item => { 
    str +=`
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${item.product.images}" alt="">
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${toThousands(item.product.price)}</td>
      <td class="cardItem-num">
        <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity - 1}" data-id="${item.id}">remove</span></a>
        ${item.quantity}
        <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity + 1}" data-id="${item.id}">add</span></a>
      </td>
      <td>NT$${toThousands(item.product.price * item.quantity)}</td>
      <td class="discardBtn">
        <a href="#" data-id=${item.id} class="material-icons">
          clear
        </a>
      </td>
    </tr>
    `;
  });
  shoppingCartBody.innerHTML = str;
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
      cartData = response.data.carts;
      sweetAlert("成功加入購物車!");  // 過場動態
      renderCartList(cartData); // 重新渲染購物車
    })
    .catch(error => {
      sweetError(error.response.data.message);
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
      sweetError(error.response.data.message);
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
      sweetError(error.response.data.message);
    })
}

// 編輯購物車產品數量
function editCartNum(num, id){
  if(num > 0) {    
    const url = `${apiUrl}carts`;
    const data = {
      "data": {
        "id": id,
        "quantity": num
      }
    };
    axios.patch(url,data)
      .then(response => {
        cartData = response.data.carts;  
        sweetAlert("成功修改購物車產品數量!");  // 過場動態      
        renderCartList(cartData);        
      })
      .catch(error => {
        sweetError(error.response.data.message);
      })
  } else {
    deleteCartItem(id);
  }
}

// 監聽購物車列表
shoppingCartBody.addEventListener("click", deleteSingleCart);
function deleteSingleCart(e) {
  e.preventDefault();
  const deleteBtnClass = e.target.getAttribute("class");
  if(deleteBtnClass === "material-icons"){
    const cartId = e.target.dataset.id;    
    deleteCartItem(cartId);   // 刪除單筆購物車
  } else if(deleteBtnClass === "material-icons cartAmount-icon") {
    const cartId = e.target.dataset.id;
    const num = Number(e.target.dataset.num);
    editCartNum(num, cartId);
  } else {
    return
  }
  


  // if(deleteBtnClass !== "material-icons") return;
  // const cartId = e.target.dataset.id;    
  // deleteCartItem(cartId);   // 刪除單筆購物車

}

// 步驟四：送出購買訂單，並再次初始化購物車列表
// 送出購買訂單
function addOrder() {
  const url = `${apiUrl}orders`;
  const data = {
    "data": {
      "user": {
        name: document.querySelector("#customerName").value.trim(),
        tel: document.querySelector("#customerPhone").value.trim(),
        email: document.querySelector("#customerEmail").value.trim(),
        address: document.querySelector("#customerAddress").value.trim(),
        payment: document.querySelector("#tradeWay").value.trim()
      }
    }
  };
  axios.post(url, data)
  .then(response => {
    getCartList();
  })
  .catch(error =>{
    sweetError(error.response.data.message);
  })
}

// 驗證器條件內容
const constraints = {
  姓名: {
    presence: {
      message: '是必填欄位',
    },
  },
  電話: {
    presence: {
      message: '是必填欄位',
    },
    length: {
      minimum: 8,
      message: '號碼需超過 8 碼',
    },
  },
  Email: {
    presence: {
      message: '是必填欄位',
    },
    email: {
      message: '格式有誤',
    },
  },
  寄送地址: {
    presence: {
      message: '是必填欄位',
    },
  },
  交易方式: {
    presence: {
      message: '是必填欄位',
    },
  },
};


// 加入訂單
const orderForm = document.querySelector(".orderInfo-form");
orderForm.addEventListener("submit", validateFn);
function validateFn(e){
  e.preventDefault();  

  if(cartData.length === 0) {
    sweetError("您的購物車是空的!");
    return;
  }

  let err = validate(orderForm, constraints);  // 通過驗證會是 undefined
  const inputs = document.querySelectorAll(".orderInfo-input");
  const orderMsg = document.querySelectorAll("[data-message]");

  if(!err){    
    addOrder(); // 通過則傳送資料
    sweetAlert("您成功送出訂單!");  // 過場動態
    inputs.forEach(item => {
      item.value = "";    
    });
    document.querySelector("#tradeWay").value = "ATM";
    orderMsg.forEach(item => {
      item.textContent = "必填";
    });
  } else {
    // 未通過時,message訊息改成驗證訊息
    orderMsg.forEach(item =>{
      item.textContent = err[item.dataset.message];
    })
  }
}




