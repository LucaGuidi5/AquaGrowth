
function readData(){
    const mioSpan = document.getElementById('xxx');
    fetch('test.json')
  .then(response => response.json())
  .then(data => {
    mioSpan.innerText = data.pippo
  });
}

window.readData = readData;