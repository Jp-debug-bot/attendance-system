from flask import render_template, request, redirect, url_for, flash
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Attendance
from datetime import datetime
from app import app

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid credentials')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        role = request.form.get('role', 'user')
        new_user = User(username=username, password=password, role=role)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/dashboard')
@login_required
def dashboard():
    attendances = Attendance.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', attendances=attendances)

@app.route('/check_in')
@login_required
def check_in():
    attendance = Attendance(user_id=current_user.id, check_in=datetime.now())
    db.session.add(attendance)
    db.session.commit()
    flash('Checked in!')
    return redirect(url_for('dashboard'))

@app.route('/check_out/<int:att_id>')
@login_required
def check_out(att_id):
    attendance = Attendance.query.get(att_id)
    if attendance and attendance.user_id == current_user.id:
        attendance.check_out = datetime.now()
        db.session.commit()
        flash('Checked out!')
    return redirect(url_for('dashboard'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))