import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Alert from '../../components/atoms/Alert'
import Paragraph from '../../components/atoms/Paragraph'
import Cointaner from '../../components/atoms/Container'
import CheckAdBlocker from '../../components/atoms/CheckAdBlocker'
import CheckoutForm from '../../components/organisms/CheckoutForm'
import CheckoutSummary from '../../components/organisms/CheckoutSummary'
import SimpleNavbar from '../../components/organisms/SimpleNavbar'

import fetchJson from '../../utils/fetchJson'
import { choices, decisions } from '../../utils/designTokens'
import { logEvent } from '../../utils/analytics'

import EPaycoService from '../../services/epayco'

import { config } from '../../config/client'
import Heading from '../../components/atoms/Heading'
import { links } from '../../utils/constants'

const sumProductSubtotals = (acc, cur) =>
  acc + Number(cur.regular_price * cur.quantity)
const getQuantityAndDiscount = (discount = 0) => product => ({
  ...product,
  quantity: product.quantity || 1,
  regular_price: `${Number(product.regular_price) - discount}`
})

let ePaycoService = {}

const Tickets = ({ countries, products }) => {
  const shoppingCartList = products.map(getQuantityAndDiscount())
  const shoppingCartTotal = shoppingCartList.reduce(sumProductSubtotals, 0)

  const [shoppingCart, setShoppingCart] = useState({
    list: shoppingCartList,
    totals: { total: shoppingCartTotal }
  })

  const handleSubmitCoupon = ({ coupon }) => {
    const shoppingCartList = products.map(getQuantityAndDiscount(coupon.amount))
    const shoppingCartTotal = shoppingCartList.reduce(sumProductSubtotals, 0)

    setShoppingCart({
      coupon: coupon,
      list: shoppingCartList,
      totals: { total: shoppingCartTotal }
    })
  }

  const handleEpaycoDialog = data => {
    ePaycoService.openDialog(data)
  }

  useEffect(() => {
    ePaycoService = new EPaycoService(config.ePaycoPublicKey, config.ePaycoTest)
    logEvent({ category: 'ticket', action: 'load', label: 'checkout' })
  }, [])

  return (
    <>
      <SimpleNavbar />
      <Cointaner>
        <div className="checkout">
          {shoppingCart && shoppingCart.list && shoppingCart.list.length ? (
            <>
              <CheckAdBlocker>
                <CheckoutForm
                  countries={countries}
                  handleEpaycoDialog={handleEpaycoDialog}
                  shoppingCartList={shoppingCart.list}
                  shoppingCartCoupon={shoppingCart.coupon}
                />
              </CheckAdBlocker>
              <CheckoutSummary
                list={shoppingCart.list}
                totals={shoppingCart.totals}
                shoppingCartCoupon={shoppingCart.coupon}
                handleSubmitCoupon={handleSubmitCoupon}
              />
            </>
          ) : (
            <Alert type="info">
              <Heading size={2} color="blue">
                Workshop tickets
              </Heading>
              <Paragraph size="sm" color="blue">
                Tendremos una cantidad limitada de entradas para unirse a
                nuestro <strong>Workshop</strong> de:
              </Paragraph>

              <Paragraph size="sm" color="blue">
                <strong>
                  Creando una libería de Componentes con Storybook, Atomic
                  Design, y Design Tokens (17 de Abril)
                </strong>
              </Paragraph>

              <Paragraph size="sm" color="blue">
                Tendremos dos sesiones de máximo <strong>20 personas</strong>{' '}
                para que puedas tener una mejor experiencia aprendiendo.
              </Paragraph>

              <Paragraph size="sm" color="blue">
                Publicaremos información sobre las entradas en nuestro redes
                sociales. Por favor, síguenos en{' '}
                <a
                  href={links.TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>{' '}
                e{' '}
                <a
                  href={links.INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instragram
                </a>
                .
              </Paragraph>
            </Alert>
          )}

          <style jsx>{`
            .checkout {
              display: flex;
              flex-direction: column-reverse;
              padding: 0 ${choices.spacing[4]};
            }

            .checkout :global(.paragraph) {
              margin-top: ${choices.spacing[4]};
            }

            @media (${decisions.queries.screens.desktop}) {
              .checkout {
                flex-direction: row;
              }
            }
          `}</style>
        </div>
      </Cointaner>
    </>
  )
}

Tickets.getInitialProps = async () => {
  const countries = await fetchJson(`${config.apiUrl}/resources/countries`)
  const products = await fetchJson(`${config.apiUrl}/products`)
  return { countries, products }
}

Tickets.propTypes = {
  countries: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
}

export default Tickets
