import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserRepo } from './../repositories/UserRepo';
import crypto from 'crypto'; // Ugradjeni modul, hashiranje, kriptovanje
import { User } from './../entities/User';

export class UserController {

    public register(req: Request, res:Response) {
        // req.body
        let username = req.body.username;
        let password = req.body.password;

        // Ide hashiranje
        let hashedPassword = crypto.pbkdf2Sync(password, username, 1000, 64, 'sha512');
        let user = new User();

        user.username = username;
        user.hashedPassword = hashedPassword.toString();

        let userRepo = new UserRepo();
        userRepo.insertUser(user).then(data => {

            let expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
;
            let token = jwt.sign({
                username: username,
                expiryDate: expiryDate
            }, 'SECRET');

            res.send({
                status: 0,
                token: token
            });

        }).catch(err => {
            res.send({
                status: -1,
                msg: 'Error while registering!'
            })
        })
    }

    public login(req:Request, res:Response) {
        let username = req.body.username;
        let password = req.body.password;
        let userRepo = new UserRepo();

        userRepo.getUserByUsername(username).then(data => {
            let hashedPassword = crypto.pbkdf2Sync(password, username, 1000, 64, 'sha512').toString();
            if (data.hashedPassword == hashedPassword) {
                // Password je ok
                let expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 1);
    ;
                let token = jwt.sign({
                    username: username,
                    expiryDate: expiryDate
                }, 'SECRET');

                res.send({
                    status: 0,
                    token: token
                });
            }
            else {
                // Password nije ok
                res.send({
                    status: -1,
                    msg: 'Wrong parameters'
                })
            }
        }).catch(err => {
            // Ne postoji korisnik sa tim username-om
            res.send({
                status: -1, 
                msg: 'Wrong parameters'
            })
        })
    }

}