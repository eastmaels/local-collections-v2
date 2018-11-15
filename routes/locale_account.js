const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');

const router = express.Router();
const LocaleAccount = mongoose.model('LocaleAccount');

const auth = require('http-auth');
const basic = auth.basic(
  {
    realm: "Users"
  }, (username, password, callback) => { 
    callback(username === process.env.BASIC_AUTH_USERNAME
      && password === process.env.BASIC_AUTH_PASSWORD);
  }
);


router.get(
  '/',
  auth.connect(basic),
  (req, res) => {
    LocaleAccount.find().sort({name: 'asc'})
      .then((locale_accounts) => {
        res.render('locale_accounts/index', { title: 'Listing Locales', locale_accounts });
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }
);

router.get(
  '/new',
  auth.connect(basic),
  (req, res) => {
    res.render('locale_accounts/new', { title: 'New Locale Account' });
  }
);

router.post(
  '/new',
  [
    body('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
  ],
  auth.connect(basic), 
  (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);

    if (errors.isEmpty()) {
      const locale = new LocaleAccount(req.body);
      locale.save()
        .then(() => { res.redirect('/locale_accounts'); })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
    } else {
      res.render('locale_accounts/new', {
        title: 'LocaleAccount form',
        errors: errors.array(),
        data: req.body,
      });
    }

  }
);

router.get(
  '/:localeId/edit/',
  auth.connect(basic),
  (req, res) => {
    LocaleAccount.findOne({name : req.params.localeId})
      .then((localeObj) => {
        res.render('locale_accounts/edit', {
          title: 'Edit LocaleAccount',
          data: localeObj,
        });
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }
);

router.post(
  '/:localeId/edit',
  [
    body('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
  ],
  auth.connect(basic), 
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const query = { name: req.body.name }
      LocaleAccount.findOneAndUpdate(query, { name: req.body.name })
        .then(() => { res.redirect('/locale_accounts'); })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
    } else {
      res.render('locale_accounts/edit', {
        title: 'LocaleAccount edit form',
        errors: errors.array(),
        data: req.body,
      });
    }

    console.log(req.body);
  }
);

router.post(
  '/:localeId/delete',
  auth.connect(basic), 
  (req, res) => {

    const query = { name: req.params.localeId }
    console.log('query', query)
    LocaleAccount.deleteOne(query)
      .then(() => {
        res.redirect('/locale_accounts');
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }
);

router.get(
  '/:localeId/monthly_collections/:monthId/edit',
  auth.connect(basic), 
  (req, res) => {
    const query = { name: req.params.localeId }
    LocaleAccount.findOne({name : req.params.localeId})
      .then((localeObj) => {
        let targetCollection = localeObj.monthly_collections.id(req.params.monthId)
        res.render('locale_accounts/monthly_collections', {
          title: 'Edit LocaleAccount',
          data: targetCollection,
        });
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }
);


router.get(
  '/:localeId/monthly_collections/:monthId/collections/new',
  auth.connect(basic), 
  (req, res) => {
    const query = { name: req.params.localeId }
    LocaleAccount.findOne({name : req.params.localeId})
      .then((localeObj) => {
        let targetCollection = localeObj.monthly_collections.id(req.params.monthId)
        res.render('locale_accounts/new_collection', {
          title: 'New Collection',
          data: targetCollection,
        });
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }
);

router.post(
  '/:localeId/monthly_collections/:monthId/collections/new',
  auth.connect(basic), 
  (req, res) => {

    console.log('req.body: ', req.body)

    LocaleAccount.findOne({name : req.params.localeId})
      .then((localeObj) => {
        let targetCollection = localeObj.monthly_collections.id(req.params.monthId)
        targetCollection.collections.push(req.body)

        localeObj.save()
      })
      .then((localeObj) => {
        let redirectUrl = `/locale_accounts/${req.params.localeId}/monthly_collections/${req.params.monthId}/edit`
        res.redirect(redirectUrl);
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }
);

module.exports = router;