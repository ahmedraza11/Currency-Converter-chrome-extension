function onPageDetailsReceived(details) {
  document.getElementById('output').innerText = details.summary;
  if(details.summary.includes('$')){
    document.getElementById('output').style.backgroundImage = "url('./img/us.png')";
  }else if(details.summary.includes('Rs')){
    document.getElementById('output').style.backgroundImage = "url('./img/pk.png')";
  }else {
    document.getElementById('output').style.backgroundColor = "gray";
  }
}
window.addEventListener('load', function(evt) {
  chrome.runtime.getBackgroundPage(function(eventPage) {
    eventPage.getPageDetails(onPageDetailsReceived);
  });
});
