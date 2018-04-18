const expect = require('expect');
const request = require('supertest');
// const bodyParser = require('body-parser');

const {app} = require('../app');
const visits = require('../modules/visits');

beforeEach(() => {
    visits.removeAll();
});

describe('app', () => {
    describe('GET /read/:filename', () => {

        it('should return 404 as file not found', done => {
                request(app)
                .get('/read/notExisting.csv')
                .expect(404)
                .end(done)
        });

        it('should return 200 as file was found', done => {
            request(app)
            .get('/read/test1.csv')
            .expect(200)
            .end(done);
        });

        it('should import visits from file test1.csv', done => {
            request(app)
            .get('/read/test1.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie, czy wczytano wszystkie wizyty poprawne, ostrzeżenia i zapisano dane z błędami
                    expect(res.body.visits.length).toBe(14);
                    expect(res.body.dataWithWarnings.length).toBe(2);
                    expect(res.body.dataWithErrors.length).toBe(4);

                    done();

            });
        });

        it('should import nothing from empty file test2.csv', done => {
            request(app)
            .get('/read/test2.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie, czy wczytano wszystkie wizyty poprawne, ostrzeżenia i zapisano dane z błędami
                    expect(res.body.visits.length).toBe(0);
                    expect(res.body.dataWithWarnings.length).toBe(0);
                    expect(res.body.dataWithErrors.length).toBe(0);

                    done();

            });
        });

        it('should throw 400 as test3.csv is empty, witout proper header', done => {
            request(app)
            .get('/read/test3.csv')
            .expect(400)
            .end(done);
        });

    });

    describe('GET /report/:filename', () => {
        it('should return 404 as file not found', done => {
            request(app)
            .get('/report/notExisting.csv')
            .expect(404)
            .end(done)
        });

        it('should return 200 as file was found', done => {
            request(app)
            .get('/report/test1.csv')
            .expect(200)
            .end(done);
        });

        it('should import nothing from empty file test2.csv', done => {
            request(app)
            .get('/report/test2.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie, czy raport jest pusty
                    expect(res.body.report.dataWithErrors.length).toBe(0);
                    expect(res.body.report.dataWithWarnings.length).toBe(0);
                    expect(res.body.report.multipleVisits).toEqual({});

                    done();

            });
        });

        it('should return empty object as test3.csv is empty, witout proper header', done => {
            request(app)
            .get('/report/test3.csv')
            .expect(400)
            .end(done);
        });

        it('should import visits from file test1.csv and generate report', done => {
            request(app)
            .get('/report/test1.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie ostrzeżeń i errorów przy imporcie wizyt
                    expect(res.body.report.dataWithWarnings.length).toBe(2);
                    expect(res.body.report.dataWithErrors.length).toBe(4);
                    
                    // sprawdzenie wielokrotnych wizyt w dniu
                    expect(res.body.report.multipleVisits['84101711210']['2018-03-01'].length).toBe(3);
                    expect(res.body.report.multipleVisits['84101711213']['2018-03-01'].length).toBe(5);
                    expect(res.body.report.multipleVisits['84101711215']['2018-03-01'].length).toBe(2);

                    done();

            });
        });
    });
});