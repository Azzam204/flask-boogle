from flask import Flask, render_template, session, request, jsonify, redirect
from boggle import Boggle

app = Flask (__name__)
app.config['SECRET_KEY'] = 'random key'

boggle_game = Boggle()

@app.route('/')
def show_board():

    session['board'] = boggle_game.make_board()
    highscore = session.get('highscore', 0)
    attempts = session.get('attempts', 0)
    
    return render_template('index.html', highscore = highscore, attempts = attempts)

@app.route('/guess')
def check_if_valid():
    word = request.args["answer"]
    guess = boggle_game.check_valid_word(session['board'],word)

    return jsonify({"result": guess , "points" : len(word)})

@app.route('/end_game', methods = ["POST"])
def score_and_end():
    score = request.json['score']
    highscore = session.get('highscore', 0)
    attempts = session.get('attempts', 0)
    session['attempts'] = attempts + 1
    session['highscore'] = max( score, highscore) 
    return jsonify(newRecord = score > highscore)