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
  // C3圖表
}
init();

// 取得訂單列表
function getOrderList() {
  const url = `${apiUrl}orders`;  
  axios.get(url, token)
  .then(response => {
    orderData = response.data.orders;
    renderOrderList();
  })
  .catch(error => {
    sweetError(error.response.data.message);
  })
}

// 渲染訂單列表
const orderList = document.querySelector(".orderList");
function renderOrderList() {  
  let str = "";
  orderData.forEach(item => {
    // 組產品字串
    let productStr = "";
    item.products.forEach(productItem => {
      productStr += `
        <p>${productItem.title} x ${productItem.quantity}</p>
      `;
    });

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
        <td>${item.createdAt}</td>
        <td class="orderStatus">
          <a href="#" data-id="${item.id}" class="js-orderStatus ${item.paid ? 'processed' : ''}" style="${item.paid ? 'pointer-events: none;' : ''}">${item.paid ? "已處理" : "未處理"}</a>
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
      sweetAlert("成功刪除全部訂單!");  // 過場動態
      getOrderList();
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
      sweetAlert("成功刪除一筆訂單!");  // 過場動態
      getOrderList(); // 重新渲染訂單列表
    })
    .catch(error => {
      sweetError(error.response.data.message);
    })
}

// 修改訂單狀態
function editOrderStatus(id) {
  const url = `${apiUrl}orders`;
  const data = {
    "data": {
      "id": id,
      "paid": true
    }
  }
  
  axios.put(url, data ,token) // axios 放置順序
    .then(response => {      
      sweetAlert("成功修改訂單狀態!");  // 過場動態
      getOrderList(); // 重新渲染訂單列表
    })
    .catch(error => {
      sweetError(error.response.data.message);
    })
}

// 監聽表單
orderList.addEventListener("click", deleteSingleOrder);
function deleteSingleOrder(e) {
  e.preventDefault();
  console.log()
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
    console.log("OK")
    const statusId = e.target.dataset.id;
    editOrderStatus(statusId);
    return
  }
}


// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
      ],
      colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
      }
  },
});

