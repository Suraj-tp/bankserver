//import jsonwebtoken
const jwt=require('jsonwebtoken')

//DATABASE
db = {
  //key:value pairs
  //key always want to be unique
  1000: { "accno": 1000, "username": "Neer", "password": 1000, "balance": 5000, transaction: [] },
  1001: { "accno": 1001, "username": "Laisha", "password": 1001, "balance": 6000, transaction: [] },
  1002: { "accno": 1002, "username": "Vypn", "password": 1002, "balance": 8000, transaction: [] }
}

//register
var register = (username, acno, password) => {
  if (acno in db) {
    return {
      status: false,
      message: "Already registered,Please log in",
      statusCode: 401
    }
  }
  else {
    db[acno] = {
      acno,
      username,
      password,
      "balance": 0,
      transaction: []
    }
    console.log(db);//if we want to see the updated database
    return {
      status: true,
      message: "Registered Successfully",
      statusCode: 200
    }
  }
}

//login
const login = (acno, pswd) => {
  if (acno in db) {
    if (pswd == db[acno]["password"]) {
      currentuser = db[acno]["username"]
      currentAcno = acno

      //genetrate token
      token=jwt.sign({
        //store account number inside token
        currentAcno:acno
      },'supersecretkey7090057755')

      
      return {
        status: true,
        message: "Login Successful",
        statusCode: 200,
        currentuser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Invalid Password",
        statusCode: 401
      }
    }
  }
  else {
    return {
      status: false,
      message: "User Credentials not found",
      statusCode: 401
    }
  }
}

//deposit
const deposit = (accno, pswd, amt) => {
  var amount = parseInt(amt)
  if (accno in db) {
    if (pswd == db[accno]["password"]) {
      db[accno]["balance"] += amount
      db[accno].transaction.push({
        type: "Credit",
        amount: amount
      })
      return {
        status: true,
        message: amount + " deposited successfuly,New balance is " + db[accno]["balance"],
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Invalid Password",
        statusCode: 401
      }

    }
  }
  else {
    return {
      status: false,
      message: "User Credentials not found",
      statusCode: 401
    }
  }
}

//withdraw

const withdraw = (accno, pswd, amt) => {
  var amount = parseInt(amt)
  if (accno in db) {
    if (pswd == db[accno]["password"]) {
      if (db[accno]["balance"] > amount) {
        db[accno]["balance"] -= amount
        db[accno].transaction.push({
          type: "Debit",
          amount: amount
        })

        return {
          status: true,
          message: amount + " debited successfuly,New balance is " + db[accno]["balance"],
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: "Insufficent Funds",
          statusCode: 422
        }

      }
    }
    else {
      return {
        status: false,
        message: "Incorrect Password",
        statusCode: 401
      }
    }

  }
  else {
    return {
      status: false,
      message: "User Credentials not found",
      statusCode: 401
    }
  }
}


//Transaction history
const getTransaction=(acno)=>{
  if(acno in db){
    return {
      status: true,
      statusCode: 200,
      transaction:db[acno].transaction
    }

  }
  else {
    return {
      status: false,
      message: "User Credentials not found",
      statusCode: 401
    }
  }
}

//export
module.exports = {
  register, login, deposit, withdraw,getTransaction
}
