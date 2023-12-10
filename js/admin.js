const api_path = "dorayu";
const apiUrl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/`
const token = {
  headers: {
    'Authorization': "cJIYbqeVkPTQ8NKEr6OaqcWrcWI3"
  }
}
let orderData = []; // 訂單列表

// 初始渲染
function init(){
  getOrderList(); // 訂單列表
  
}
init();

// 取得訂單列表
function getOrderList() {
  const url = `${apiUrl}orders`;  
  axios.get(url, token)
  .then(response => {
    orderData = response.data.orders;
    orderData.sort((a, b) => b.createdAt - a.createdAt);
    renderOrderList(orderData);
    categoryC3(); // C3圖表-LV1
    revenueC3(); // C3圖表-LV2
  })
  .catch(error => {
    sweetError(error.response.data.message);
  })
}

// 渲染訂單列表
const orderList = document.querySelector(".orderList");
function renderOrderList(mydata) {  
  let str = "";

  mydata.forEach(item => {
    // 組產品字串
    let productStr = "";
    item.products.forEach(productItem => {
      productStr += `
        <p>${productItem.title} x ${productItem.quantity}</p>
      `;
    });
    // 組合時間
    const timestamp = new Date(item.createdAt*1000);
    const thisTime = `${timestamp.getFullYear()}/${timestamp.getMonth()+1}/${timestamp.getDate()}`;

    str += `
      <tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${productStr}
        </td>
        <td>${thisTime}</td>
        <td class="orderStatus">
          <a href="#" data-id="${item.id}" data-paid="${item.paid}" class="js-orderStatus">${item.paid ? "已處理" : "未處理"}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
        </td>
      </tr>
    `;
  });
  orderList.innerHTML = str;
}


// 清除全部訂單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteAllOrderList();
})

function deleteAllOrderList() {
  const url = `${apiUrl}orders`;
  axios.delete(url, token)
    .then(response => {   
      orderData = response.data.orders;
      sweetAlert("成功刪除全部訂單!");  // 過場動態
      renderOrderList(orderData);
    })
    .catch(error => {
      sweetError(error.response.data.message);
    })
}

// 清除單筆訂單
function deleteOrderItem(id) {
  const url = `${apiUrl}orders/${id}`;
  axios.delete(url, token)
    .then(response => {      
      orderData = response.data.orders;
      sweetAlert("成功刪除一筆訂單!");  // 過場動態
      renderOrderList(orderData); // 重新渲染訂單列表
    })
    .catch(error => {
      sweetError(error.response.data.message);
    })
}

// 修改訂單狀態
function editOrderStatus(id, paid) {
  const url = `${apiUrl}orders`;
  const data = {
    "data": {
      "id": id,
      "paid": paid
    }
  }
  axios.put(url, data ,token) // axios 放置順序
    .then(response => {    
      orderData = response.data.orders;
      sweetAlert("成功修改訂單狀態!");  // 過場動態
      renderOrderList(orderData); // 重新渲染訂單列表
    })
    .catch(error => {
      sweetError(error.response.data.message);
    })
}

// 監聽表單
orderList.addEventListener("click", deleteSingleOrder);
function deleteSingleOrder(e) {
  e.preventDefault();
  const orderClass = e.target.getAttribute("class");
  if(orderClass === null) {
    return;
  }
  if(orderClass === "delSingleOrder-Btn") {
    const statusId = e.target.dataset.id;
    deleteOrderItem(statusId);
    return
  }
  if(orderClass === "js-orderStatus") {
    const statusId = e.target.dataset.id;
    const statusPaid = e.target.dataset.paid;
    let newStatus;
    if (statusPaid == 'true') {
      newStatus = false;
    } else {
      newStatus = true;
    }
    editOrderStatus(statusId, newStatus);
    return
  }
}

// 全產品類別營收比重 - LV1 ,類別含三項，共有：床架、收納、窗簾
function categoryC3(){
  let obj = {};  
  orderData.forEach(item => {
    item.products.forEach(productItem => {
      if(obj[productItem.category] === undefined) {
        obj[productItem.category] = productItem.price * productItem.quantity;
      } else {
        obj[productItem.category] += productItem.price * productItem.quantity;
      }
    });
  });
  
  let newData = [];
  let category = Object.keys(obj);
  category.forEach((item,index) => {
    let ary = [];
    ary.push(item);
    ary.push(obj[item]);
    newData.push(ary);
  });

  // 顏色
  let colors = ["#DACBFF","#9D7FEA","#5434A7","#301E5F"];
  let newColor = {};
  Object.keys(obj).forEach((key, index) => {
    newColor[key] = colors[index];
  });

  renderC3("#chart", newData, newColor);
}

// 全品項營收比重 - LV2 , 類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」
function revenueC3() {
  let obj = {};
  orderData.forEach(item => {
    item.products.forEach(productItem => {
      if(obj[productItem.title] === undefined) {
        obj[productItem.title] = productItem.price * productItem.quantity;
      } else {
        obj[productItem.title] += productItem.price * productItem.quantity;
      }
    });
  });
  
  let newData = [];
  let title = Object.keys(obj);
  title.forEach((item,index) => {
    let ary = [];
    ary.push(item);
    ary.push(obj[item]);
    newData.push(ary);
  });
  
  // 排序：由大到小
  newData.sort((a,b)=>{
    return b[1] - a[1];  // 取出 a, b 陣列裡索引為 1 的值做比較
  });

  // 組合第四筆金額加總
  if(newData.length > 3) {
    let otherPrice = 0;
    newData.forEach((item,index) => {
      if(index > 2) { // 從0開始算, 索引第4筆開始計算加總
        otherPrice += item[1];
      }
    });
    newData.splice(3, newData.length -1); // 從第四筆後刪除全部
    newData.push(["其他", otherPrice]); // push新加總的其他
  }  

  // 顏色
  let colors = ["#DACBFF","#9D7FEA","#5434A7","#301E5F"];
  let newColor = {};
  newData.forEach((item,index) => {
    const [productName, price] = item;  // es6 解構賦值
    newColor[productName] = colors[index];
  });  
  
  renderC3("#chart2", newData, newColor);
}

// renderC3 
function renderC3(div, ary, color) {
  const chart = c3.generate({
    bindto: div, // HTML 元素綁定
    data: {
        type: "pie",
        columns: ary,
        colors: color
    },
  });
}


