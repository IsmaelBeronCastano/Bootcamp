import { sequelize } from "../database/dbConnection";
import { IProduct } from "../interfaces/IProduct.interface";
import { DataTypes, Model, ModelDefined, Optional } from "sequelize";

type ProductsCreationAttributes = Optional<IProduct, 'id' | 'createdAt' | 'updatedAt'> //id no necesario en la creación (auto mysql)

const ProductModel: ModelDefined<IProduct, ProductsCreationAttributes>= sequelize.define('products',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    quantity:{
        type: DataTypes.NUMBER,
        allowNull: true
    },
    avaliable:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt:{
        type: DataTypes.DATE,
        allowNull: false
    },
    updateedAt:{
        type: DataTypes.DATE,
        allowNull: false
    }
    
},{
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ]
})

ProductModel.addHook('beforeCreate', async (product: Model<IProduct>)=>{

    product.dataValues.name = product.dataValues.name.replace(/\s+/g, '_').toLowerCase()
    
})

