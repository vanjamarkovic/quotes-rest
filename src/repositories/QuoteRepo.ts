import { Quote } from './../entities/Quote';
import { getManager } from 'typeorm';

export class QuoteRepo {

    getAllQuotes() {
        return getManager().getRepository(Quote).find({ relations: ['comments'] });
    }

    getQuoteById(id:number) {
        return getManager().getRepository(Quote).findOne(id);
    }

    createQuote(quote:Quote) {
        return getManager().getRepository(Quote).insert(quote);
    }

    updateQuote(quote:Quote) {
        return getManager().getRepository(Quote).save(quote);
    }

    deleteQuote(id:number) {
        return getManager().getRepository(Quote).delete(id);
    }
}