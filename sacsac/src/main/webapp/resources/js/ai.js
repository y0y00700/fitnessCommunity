var hashtagsArray = [];

function addHashtag(event) {
    if (event.key === "Enter" || event.type === "click") {
        event.preventDefault(); 

        var input = document.getElementById("hashtags");
        var hashtag = input.value.trim();
        
        // 한글 포함 여부 검사
        if (/[\uAC00-\uD7AF]/.test(hashtag)) {
            alert("영문으로 키워드를 입력하세요.");
            return;
        }
        
        if (hashtag === "") {
            alert("키워드를 입력하세요!");
            return;
        }
        if (hashtagsArray.length >= 5) {
            alert("키워드는 최대 5개까지 가능합니다.");
            return;
        }
        if (hashtagsArray.includes("#" + hashtag)) {
            alert("중복된 키워드가 존재합니다.");
            return;
        }

        hashtagsArray.push("#" + hashtag);

        var hashtagContainer = document.getElementById("hashtag-container");
        var span = document.createElement("span");
        span.className = "hashtag";

        var textNode = document.createTextNode("#" + hashtag);

        var removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.innerText = "x";
        removeBtn.onclick = function () {
            removeHashtag(span, hashtag);
        };

        span.appendChild(textNode);
        span.appendChild(removeBtn);
        hashtagContainer.appendChild(span);

        input.value = ""; 
    }
}
    
    document.getElementById("add-hashtag-button").addEventListener("click", addHashtag);
    
    function removeHashtag(element, hashtag) {
        hashtagsArray = hashtagsArray.filter(function (item) {
            return item !== "#" + hashtag;
        });
        element.remove();
    }

    function openPopup() {
        if (hashtagsArray.length === 0) {
            alert("최소 1개 이상의 키워드를 추가하세요.");
            return;
        }

        var processedHashtags = hashtagsArray.map(function (hashtag) {
            return hashtag.substring(1);
        });

        var url = "https://mashironeko.onrender.com/process";
        var params = JSON.stringify({ hashtags: processedHashtags.join(", ") });

        
        var loadingContainer = document.getElementById("loading-container");
        var inputField = document.getElementById("hashtags");
        var generateButton = document.querySelector("button[onclick='openPopup()']");
        var addHashtagButton = document.getElementById("add-hashtag-button"); 
        var removeButtons = document.querySelectorAll(".remove-btn");
        var iframeContainer = document.getElementById("iframe-container");
        var duckflyContainer = document.getElementById("duckfly-container"); 

   
        duckflyContainer.style.display = "none"; 

        
        loadingContainer.style.display = "block";
        iframeContainer.style.display = "none"; 
        inputField.disabled = true;
        generateButton.disabled = true;
        addHashtagButton.disabled = true; 
        generateButton.classList.add("disabled"); 
        removeButtons.forEach(function (button) {
            button.disabled = true;
        });

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: params
        })
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            iframeContainer.innerHTML = "";
            var iframe = document.createElement("iframe");
            iframe.srcdoc = html;
            iframeContainer.appendChild(iframe);

 
            loadingContainer.style.display = "none";
            iframeContainer.style.display = "block"; 
            inputField.disabled = false;
            generateButton.disabled = false;
            addHashtagButton.disabled = false; 
            generateButton.classList.remove("disabled"); 
            removeButtons.forEach(function (button) {
                button.disabled = false;
            });
        })
        .catch(function (error) {
            console.error("Error:", error);
            alert("AI효과음 생성중 오류가 발생하였습니다.");

     
            loadingContainer.style.display = "none";
            iframeContainer.style.display = "block"; 
            inputField.disabled = false;
            generateButton.disabled = false;
            addHashtagButton.disabled = false; 
            generateButton.classList.remove("disabled"); 
            removeButtons.forEach(function (button) {
                button.disabled = false;
            });
        });
    }