const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const addtokenToObject = (user) => {
    const payload = { id: user.id, username: user.name };
    let userObj = user.toJSON();
    const token = jwt.sign(payload, 'suman'); //where suman is secret key 
    userObj['token'] = token;

    return userObj;
};

class UserController {

    constructor(model) {
        this.model = User;
    }

    auth(options) {
        return this.model.findOne({ email: options.email })
            .exec()
            .then((user) => {
                if (!user) {
                    return new Error('invalid login credentials');
                }
                if (options.password === user.password) {
                    return addtokenToObject(user);
                } else {
                    return new Error('invalid login credentials');
                }
            }).catch(err => {
                return err;
            });
    }


    index() {
        return this.model.find()
            .sort('created')
            .exec()
            .then(rec => {
                return rec;
            }).catch(err => {
                return err;
            });
    }

    single(options) {
        return this.model.findOne({ _id: options.id })
            .exec()
            .then(rec => {
                return rec;
            }).catch(err => {
                return err;
            });
    }

    create(data) {
        const record = new this.model(data);
        return record.save()
            .then((user) => {
                return user.save()
                    .then(update => {
                        return addtokenToObject(updated);
                    })
                    .catch(err => {
                        return err;
                    });
            })
            .catch(err => {
                return err;
            });
    }

    update(user, data) {
        return this.model.findOne({ _id: user.id })
            .exec()
            .then((record) => {
                return record.save()
                    .then(user => {
                        return user.save()
                            .then(updated => {
                                return updated;
                            })
                            .catch((err) => {
                                return err;
                            });
                    })
                    .catch((err) => {
                        return err;
                    });
            })
            .catch((err) => {
                return err;
            })
    }


}