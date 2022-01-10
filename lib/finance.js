/**
 * @namespace faker.finance
 */
const Finance = function (faker) {
  const ibanLib = require('./iban')
  const Helpers = faker.helpers
  const self = this

  /**
   * account
   *
   * @method faker.finance.account
   * @param {number} length
   */
  self.account = function (length) {
    length = length || 8

    let template = ''

    for (let i = 0; i < length; i++) {
      template = template + '#'
    }
    length = null
    return Helpers.replaceSymbolWithNumber(template)
  }

  /**
   * accountName
   *
   * @method faker.finance.accountName
   */
  self.accountName = function () {
    return [Helpers.randomize(faker.definitions.finance.account_type), 'Account'].join(' ')
  }

  /**
   * routingNumber
   *
   * @method faker.finance.routingNumber
   */
  self.routingNumber = function () {
    const routingNumber = Helpers.replaceSymbolWithNumber('########')

    // Modules 10 straight summation.
    let sum = 0

    for (let i = 0; i < routingNumber.length; i += 3) {
      sum += Number(routingNumber[i]) * 3
      sum += Number(routingNumber[i + 1]) * 7
      sum += Number(routingNumber[i + 2]) || 0
    }

    return routingNumber + (Math.ceil(sum / 10) * 10 - sum)
  }

  /**
   * mask
   *
   * @method faker.finance.mask
   * @param {number} length
   * @param {boolean} parens
   * @param {boolean} ellipsis
   */
  self.mask = function (length, parens, ellipsis) {
    // set defaults
    length = (length == 0 || !length || typeof length === 'undefined') ? 4 : length
    parens = (parens === null) ? true : parens
    ellipsis = (ellipsis === null) ? true : ellipsis

    // create a template for length
    let template = ''

    for (let i = 0; i < length; i++) {
      template = template + '#'
    }

    // prefix with ellipsis
    template = (ellipsis) ? ['...', template].join('') : template

    template = (parens) ? ['(', template, ')'].join('') : template

    // generate random numbers
    template = Helpers.replaceSymbolWithNumber(template)

    return template
  }

  // min and max take in minimum and maximum amounts, dec is the decimal place you want rounded to, symbol is $, €, £, etc
  // NOTE: this returns a string representation of the value, if you want a number use parseFloat and no symbol

  /**
   * amount
   *
   * @method faker.finance.amount
   * @param {number} min
   * @param {number} max
   * @param {number} dec
   * @param {string} symbol
   *
   * @return {string}
   */
  self.amount = function (min, max, dec, symbol, autoFormat) {
    min = min || 0
    max = max || 1000
    dec = dec === undefined ? 2 : dec
    symbol = symbol || ''
    const randValue = faker.datatype.number({ max: max, min: min, precision: Math.pow(10, -dec) })

    let formattedString
    if (autoFormat) {
      formattedString = randValue.toLocaleString(undefined, { minimumFractionDigits: dec })
    } else {
      formattedString = randValue.toFixed(dec)
    }

    return symbol + formattedString
  }

  /**
   * transactionType
   *
   * @method faker.finance.transactionType
   */
  self.transactionType = function () {
    return Helpers.randomize(faker.definitions.finance.transaction_type)
  }

  /**
   * currencyCode
   *
   * @method faker.finance.currencyCode
   */
  self.currencyCode = function () {
    return faker.random.objectElement(faker.definitions.finance.currency).code
  }

  /**
   * currencyName
   *
   * @method faker.finance.currencyName
   */
  self.currencyName = function () {
    return faker.random.objectElement(faker.definitions.finance.currency, 'key')
  }

  /**
   * currencySymbol
   *
   * @method faker.finance.currencySymbol
   */
  self.currencySymbol = function () {
    let symbol

    while (!symbol) {
      symbol = faker.random.objectElement(faker.definitions.finance.currency).symbol
    }
    return symbol
  }

  /**
   * bitcoinAddress
   *
   * @method  faker.finance.bitcoinAddress
   */
  self.bitcoinAddress = function () {
    const addressLength = faker.datatype.number({ min: 25, max: 34 })

    let address = faker.random.arrayElement(['1', '3'])

    for (let i = 0; i < addressLength - 1; i++) { address += faker.random.arrayElement('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'.split('')) }

    return address
  }

  /**
 * litecoinAddress
 *
 * @method  faker.finance.litecoinAddress
 */
  self.litecoinAddress = function () {
    const addressLength = faker.datatype.number({ min: 26, max: 33 })

    let address = faker.random.arrayElement(['L', 'M', '3'])

    for (let i = 0; i < addressLength - 1; i++) { address += faker.random.arrayElement('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'.split('')) }

    return address
  }

  /**
   * Credit card number
   * @method faker.finance.creditCardNumber
   * @param {string} provider | scheme
  */
  self.creditCardNumber = function (provider) {
    provider = provider || ''
    let format, formats
    const localeFormat = faker.definitions.finance.credit_card
    if (provider in localeFormat) {
      formats = localeFormat[provider] // there chould be multiple formats
      if (typeof formats === 'string') {
        format = formats
      } else {
        format = faker.random.arrayElement(formats)
      }
    } else if (provider.match(/#/)) { // The user chose an optional scheme
      format = provider
    } else { // Choose a random provider
      if (typeof localeFormat === 'string') {
        format = localeFormat
      } else if (typeof localeFormat === 'object') {
        // Credit cards are in a object structure
        formats = faker.random.objectElement(localeFormat, 'value') // There chould be multiple formats
        if (typeof formats === 'string') {
          format = formats
        } else {
          format = faker.random.arrayElement(formats)
        }
      }
    }
    format = format.replace(/\//g, '')
    return Helpers.replaceCreditCardSymbols(format)
  }
  /**
   * Credit card CVV
   * @method faker.finance.creditCardCVV
  */
  self.creditCardCVV = function () {
    let cvv = ''
    for (let i = 0; i < 3; i++) {
      cvv += faker.datatype.number({ max: 9 }).toString()
    }
    return cvv
  }

  /**
   * ethereumAddress
   *
   * @method  faker.finance.ethereumAddress
   */
  self.ethereumAddress = function () {
    const address = faker.datatype.hexaDecimal(40).toLowerCase()
    return address
  }

  /**
   * iban
   *
   * @param {boolean} [formatted=false] - Return a formatted version of the generated IBAN.
   * @param {string} [countryCode] - The country code from which you want to generate an IBAN, if none is provided a random country will be used.
   * @throws Will throw an error if the passed country code is not supported.
   *
   * @method  faker.finance.iban
   */
  self.iban = function (formatted, countryCode) {
    let ibanFormat
    if (countryCode) {
      const findFormat = function (currentFormat) { return currentFormat.country === countryCode }
      ibanFormat = ibanLib.formats.find(findFormat)
    } else {
      ibanFormat = faker.random.arrayElement(ibanLib.formats)
    }

    if (!ibanFormat) {
      throw new Error('Country code ' + countryCode + ' not supported.')
    }

    let s = ''
    let count = 0
    for (let b = 0; b < ibanFormat.bban.length; b++) {
      const bban = ibanFormat.bban[b]
      let c = bban.count
      count += bban.count
      while (c > 0) {
        if (bban.type == 'a') {
          s += faker.random.arrayElement(ibanLib.alpha)
        } else if (bban.type == 'c') {
          if (faker.datatype.number(100) < 80) {
            s += faker.datatype.number(9)
          } else {
            s += faker.random.arrayElement(ibanLib.alpha)
          }
        } else {
          if (c >= 3 && faker.datatype.number(100) < 30) {
            if (faker.datatype.boolean()) {
              s += faker.random.arrayElement(ibanLib.pattern100)
              c -= 2
            } else {
              s += faker.random.arrayElement(ibanLib.pattern10)
              c--
            }
          } else {
            s += faker.datatype.number(9)
          }
        }
        c--
      }
      s = s.substring(0, count)
    }
    let checksum = 98 - ibanLib.mod97(ibanLib.toDigitString(s + ibanFormat.country + '00'))
    if (checksum < 10) {
      checksum = '0' + checksum
    }
    const iban = ibanFormat.country + checksum + s
    return formatted ? iban.match(/.{1,4}/g).join(' ') : iban
  }

  /**
   * bic
   *
   * @method  faker.finance.bic
   */
  self.bic = function () {
    const vowels = ['A', 'E', 'I', 'O', 'U']
    const prob = faker.datatype.number(100)
    return Helpers.replaceSymbols('???') +
          faker.random.arrayElement(vowels) +
          faker.random.arrayElement(ibanLib.iso3166) +
          Helpers.replaceSymbols('?') + '1' +
          (prob < 10
            ? Helpers.replaceSymbols('?' + faker.random.arrayElement(vowels) + '?')
            : prob < 40
              ? Helpers.replaceSymbols('###')
              : '')
  }

  /**
   * description
   *
   * @method  faker.finance.transactionDescription
   */
  self.transactionDescription = function () {
    const transaction = Helpers.createTransaction()
    const account = transaction.account
    const amount = transaction.amount
    const transactionType = transaction.type
    const company = transaction.business
    const card = faker.finance.mask()
    const currency = faker.finance.currencyCode()
    return transactionType + ' transaction at ' + company + ' using card ending with ***' + card + ' for ' + currency + ' ' + amount + ' in account ***' + account
  }
}

module.exports = Finance
