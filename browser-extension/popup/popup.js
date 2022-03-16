    function getActivateValue(){
        var activatedValue = localStorage.getItem("holypicsactivatedvalue")
        return activatedValue=="true"
    }
    
    var activateBox = document.getElementById("activate")
    if(getActivateValue()){
        activateBox.setAttribute("checked", "checked")
    }else{
        activateBox.removeAttribute("checked")
    }
    
    

    activateBox.addEventListener("change", function(){
        if(getActivateValue()){
            localStorage.setItem("holypicsactivatedvalue", "false")
        }else{
            localStorage.setItem("holypicsactivatedvalue", "true")
        }
        
    })