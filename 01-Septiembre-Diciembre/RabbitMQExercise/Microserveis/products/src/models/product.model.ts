import { sequelize } from "../database/dbConnection";
import { IProduct } from "../interfaces/IProduct.interface";
import { DataTypes, Model, ModelDefined, Optional } from "sequelize";

 //id no necesario en la creación (auto mysql)
type ProductsCreationAttributes = Optional<IProduct, 'id' | 'createdAt' | 'updatedAt'>
export const ProductModel: ModelDefined<IProduct, ProductsCreationAttributes>= sequelize.define('products',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price:{
        type: DataTypes.STRING,
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
    creator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt:{
        type: DataTypes.DATE,
        
    },
    updateedAt:{
        type: DataTypes.DATE,

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

