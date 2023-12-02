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