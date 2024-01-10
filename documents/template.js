module.exports = ({ name, age, address, image }) => {
    console.log(name)
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                .mainDiv{
                    margin:auto;
                    width: 70vw;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border : 1px solid black;
                    border-radius: 10px;
                    padding: 10px 20px;
                    text-align:center;
                }
                .mainDiv > img{
                    width : 200px;
                }
            </style>
        </head>
        <body>
            <div class="mainDiv">
            <img src='http://localhost:8000/uploads/${image}' alt="avatar">
            <h4>Name : ${name}</h4>
            <h4>Age : ${age}</h4>
            <h4>Address : ${address}</h4>
    </div>     
        </body>
    </html>
    `
}