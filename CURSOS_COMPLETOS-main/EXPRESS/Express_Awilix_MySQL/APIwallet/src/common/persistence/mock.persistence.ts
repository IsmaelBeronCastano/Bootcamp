export const db ={
    balance:[{
        id: 1,
        user_id:1,
        amount: 100
    },{
        id: 2,
        user_id:2,
        amount: 100
    }, {
        id: 3,
        user_id:3,
        amount: 100
    }],
    movement:[],
    subscription:[],
    balance_id: 0,
    movement_id: 0,
    subscription_id: 0
}

db.balance_id = db.balance.length

