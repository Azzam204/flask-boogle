const form = document.querySelector('form');
const wordList = document.querySelector('.words');
const msg = document.querySelector('.msg');
const score = document.querySelector('.score');
const secs = document.querySelector('.secs');
const words = new Set()

document.querySelector('input').focus();

form.addEventListener('submit', function(e){
    e.preventDefault();
})
form.addEventListener('submit', submit)

async function submit(e) {
    const answer = e.target[0].value;
    if (words.has(answer.toUpperCase())){
        msg.innerText = "Word already found!!"
        e.target[0].value = '';
        return
    }
    const response = await axios.get('/guess', { params : { answer: answer}});
    msg.innerText = response.data.result + '!';
    if (response.data.result === 'ok' && !words.has(answer.toUpperCase())) {
        words.add(answer.toUpperCase());
        let newWord = document.createElement('li');
        newWord.innerText = answer.toUpperCase();
        wordList.append(newWord);

        score.innerText = parseInt(score.innerText) + response.data.points;
    }
    e.target[0].value = '';
    console.log(response.data.result , response.data.points)
}

let timer = setInterval(async function(){
    secs.innerText = parseInt(secs.innerText) - 1;
    if(secs.innerText == 0){
        clearInterval(timer);
        await endGame();
    }
}, 500);

async function endGame() {
    wordList.innerHTML = '';
    form.removeEventListener('submit', submit)
    const response = await axios.post('/end_game', {score : parseInt(score.innerText)});
    if (response.data.newRecord) {
        msg.innerText = `NEW RECORD - ${parseInt(score.innerText)}`
    }
    else{
        msg.innerText = `FINAL SCORE - ${parseInt(score.innerText)}`
    }
}