import express from  'express';
import * as config from './common/AppConfig';

// importujemo bodyParser
import bodyParser from 'body-parser';

// Ovo je poziv za kreiranje konekcije
import { createConnection } from 'typeorm'; 

//importujemo experess-jwt modul

import expressjwt from 'express-jwt';

// Import za multer i path modul - ovo nam je za upload fajla
import multer from 'multer';
import path from 'path';

import { Request, Response } from 'express';
import { QuoteController } from './controllers/QuoteController';
import { CommentController } from './controllers/CommentController';
import { UserController } from './controllers/UserController';

class  App {
    app: express.Application;
    quoteController: QuoteController = new QuoteController();
    commentController: CommentController = new CommentController();
    userController: UserController = new UserController();

    storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.join(__dirname, 'public/uploads'))
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + '-' + file.originalname)
        }
    });

    multer = multer({storage: this.storage});

    constructor() {
        this.app = express();
        this.config();
        this.routing();
        this.connectToDb();
    }

    private config(){
        this.app.use(bodyParser.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        //console.log(path.join(__dirname, 'public/uploads'));

        this.app.use((req:Request, res:Response, next) => {

            res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With,Authorization');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

            next();
        })
    }

    private routing() {
        const router = express.Router();

        let auth = expressjwt({
            secret: 'SECRET',
            userProperty: 'body.userData'
        })

        router.get('/quote',auth, this.quoteController.getAllQuotes);
        router.get('/quote/:id', this.quoteController.getQuoteById);
        router.post('/quote', this.quoteController.createQuote);
        router.put('/quote', this.quoteController.updateQuote);
        router.delete('/quote/:id', this.quoteController.deleteQuote);

        router.get('/comment', this.commentController.getAllComments);
        router.get('/comment/:id', this.commentController.getCommentById);
        router.post('/comment', this.commentController.createComment);
        router.put('/comment', this.commentController.updateComment);
        router.delete('/comment/:id', this.commentController.deleteComment);

        router.post('/upload',
                    this.multer.single('img'),
                    (req:Request, res:Response) => {
                        if (!req.file) {
                            res.send({
                                status: -1,
                                msg: 'No file uploaded!'
                            })
                        }
                        else {
                            res.send({
                                status: 0,
                                msg: 'File uploaded',
                                filename: req.file.filename
                            })
                        }
                    })

        router.post('/register', this.userController.register);
        router.post('/login', this.userController.login);

        this.app.use(router);
    }

    private connectToDb(){
        createConnection(config.dbConfig).then(connection => {
            console.log('Connected to DB');
        }).catch(err => {
            console.log('ERROR');
        })
    }
}

export default new App().app;