async function auditWebsite(){

    const url=document.getElementById("url").value;

    const result=document.getElementById("result");
    const loading=document.getElementById("loading");


    if(!url){
        alert("Please enter website URL");
        return;
    }


    loading.style.display="block";
    result.innerHTML="";


    try{

        const response=await fetch("https://digital-heroes-page-pulse-2.onrender.com/analyze",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                url:url
            })

        });


        const data=await response.json();


        loading.style.display="none";


        if(!response.ok){

            result.innerHTML=`

            <div class="metric danger">

            <h3>Error</h3>

            <p>${data.error}</p>

            </div>

            `;

            return;
        }



        result.innerHTML=`

        <div class="card">


        <div class="metric success">
        <h3>HTTP Status</h3>
        <p>${data.statusCode}</p>
        </div>


        <div class="metric info">
        <h3>Response Time</h3>
        <p>${data.responseTime}</p>
        </div>


        <div class="metric purple">
        <h3>Page Title</h3>
        <p>${data.title}</p>
        </div>


        <div class="metric teal">
        <h3>Meta Description</h3>
        <p>${data.description}</p>
        </div>


        <div class="metric gold">
        <h3>H1 Count</h3>
        <p>${data.h1Count}</p>
        </div>


        <div class="metric warning">
        <h3>Images Missing ALT</h3>
        <p>${data.imagesWithoutAlt}</p>
        </div>


        <div class="metric success">
        <h3>Word Count</h3>
        <p>${data.wordCount}</p>
        </div>


        <div class="metric info">
        <h3>SEO Score</h3>
        <p>${calculateSEO(data)}/100</p>
        </div>


        </div>

        `;


    }

    catch(error){

        loading.style.display="none";


        result.innerHTML=`

        <div class="metric danger">

        <h3>Server Error</h3>

        <p>Cannot connect to backend</p>

        </div>

        `;

    }

}



function calculateSEO(data){

    let score=0;


    if(data.title!=="Not found")
        score+=25;


    if(data.description!=="Not found")
        score+=25;


    if(data.h1Count>0)
        score+=20;


    if(data.imagesWithoutAlt===0)
        score+=15;


    if(data.wordCount>300)
        score+=15;


    return score;

}