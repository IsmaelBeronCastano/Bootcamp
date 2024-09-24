- Para el modelo
~~~js
import { sequelize } from '@auth/database';
import { IAuthDocument } from '@uzochukwueddie/jobber-shared';
import { compare, hash } from 'bcryptjs';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUND = 10; //es 10 por defecto, 
                       //numero de veces que el algoritmo de encriptación se ejecutarà

interface AuthModelInstanceMethods extends Model {
  //AuthModel deberá tener estos dos métodos 
  prototype: {
    comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<string>;
  }
}
                            //Optional para que incluya IAuthDocument pero no lo siguiente al crear el usuario
type AuthUserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'>;
                                                                         
                  //Modeldefined para decir que podemos crear users tipo IAuth y que no lleven el id, createdAt en la creación
                                                //Debe contener los métodos comparePassword y hashPassword 
const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods = sequelize.define('auths', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePublicId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  browserName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING
  },
  otpExpiration: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now //crea una fecha al momento de la creación
  },
  passwordResetToken: { 
    type: DataTypes.STRING, 
    allowNull: true },

  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date() //puedo usar Date.now o new Date()
  }
}, {
  indexes: [  //uso los indices para marcar que deben ser únicos e indexarlos
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['emailVerificationToken']
    },
  ]
}) as ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods;

//añado el hook beforeCreate para hashear el password, le paso el modelo
AuthModel.addHook('beforeCreate', async (auth: Model) => {
  //guardo el password hasheado             el password esta aqui
  const hashedPassword: string = await hash(auth.dataValues.password as string, SALT_ROUND);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
};

AuthModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};
//si uso force: true borrará la db con cada reset del server
AuthModel.sync({}); //ejecuto, si la tabla no existe la creará, si existe no hará nada
export { AuthModel };

~~~