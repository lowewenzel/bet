# app.py - a minimal flask api using flask_restful
from flask import Flask, g
from flask_pymongo import PyMongo
from flask_restful import Resource, Api

import humongolus as orm
import datetime
import humongolus.field as field


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/bet"
mongo = PyMongo(app)
api = Api(app)

class User(Resource):
    def get(self):
        return mongo.db.users.find()

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

class Bet(Resource):
    def get(self):
        return [doc for doc in mongo.db.bets.find()]

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

api.add_resource(User, '/auth')
api.add_resource(Bet, '/')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
