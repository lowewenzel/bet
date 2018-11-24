import humongolus as orm
import datetime
import humongolus.field as field

class User(orm.Document):
  _collection = "users"
  username = field.Char(required=True, min=2, max=24)
  password = field.Char()
  bets = orm.List(type=Bet)

class Bet(orm.Document):
  _collection = "bets"
  amount = field.float(min=0.01, max=1000)
  title = field.Char(required=True, min=4, max=18)
  description = field.Char()
  bet_user = orm.modelChoice(type=User)
  betee_user = orm.modelChoice(type=User)