const api_path = "dorayu";
const apiUrl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/`
const token = "cJIYbqeVkPTQ8NKEr6OaqcWrcWI3";
let orderData = []; // 訂單列表

// 取得訂單列表
function getOrderList() {
  const url = `${apiUrl}orders`;
  const data = {
    headers: {
      'Authorization': token
    }
  }
  axios.get(url, data)
  .then(function (response) {
    orderData = response.data.orders;
    renderOrderList();
  })
  .catch(error => {
    sweetError(error.response.data.message);
  })
}
getOrderList()

// 渲染訂單列表
const orderList = document.querySelector(".orderList");
function renderOrderList() {  
  let str = "";
  orderData.forEach(item => {
    // console.log(item);
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
          <a href="#">${item.paid ? "已處理" : "未處理"}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
        </td>
      </tr>
    `;
  });
  orderList.innerHTML = str;
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

