from flask import Flask
from flask import render_template
from flask import request, session, redirect, flash
from sqlalchemy.orm import sessionmaker
from tabledef import *

app = Flask(__name__)
engine = create_engine('sqlite:///hust.db/', echo=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    todos = []

    if session.get('loggedin') == True:
        Session = sessionmaker(bind=engine)
        engine_session = Session()

        current_user = engine_session.query(User).get(session['user_id'])

        if request.method == 'POST':
            new_todo = request.form['new']

            if new_todo != '':
                todo = Todo(content=new_todo, user=current_user)
                engine_session.add(todo)
                engine_session.commit()

        user_todos = current_user.todos.all()

        for todo in user_todos:
            todos.append([todo.id, todo.content])
    return render_template('home.html', list=todos)

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        Session = sessionmaker(bind=engine)
        engine_session = Session()

        query = engine_session.query(User).filter(User.username.in_([username]), User.password.in_([password]))
        result = query.first()

        if result:
            session['loggedin'] = True
            session['username'] = result.username
            session['user_id'] = result.id
    return render_template('signin.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username != "" and password != "":
            Session = sessionmaker(bind=engine)
            engine_session = Session()

            new_user = User(username=username, password=password)
            engine_session.add(new_user)
            engine_session.commit()

            flash('Thanks for registering!')
        else:
            flash('There was an error with your registration D;')
    return render_template('signup.html')

@app.route('/logout')
def logout():
    session['loggedin'] = False
    return redirect('/')

@app.route('/delete')
def delete():
    if session.get('loggedin'):
        Session = sessionmaker(bind=engine)
        engine_session = Session()

        item_id = int(request.args.get('id'))
        todo = engine_session.query(Todo).get(item_id)
        engine_session.delete(todo)
        engine_session.commit()
    return redirect('/')

app.secret_key = "wownoonewilleverguessthis"
app.run(debug=True, port=4000)
