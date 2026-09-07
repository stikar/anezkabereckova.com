import { FooterClient } from './FooterClient'

export function Footer() {
  return <FooterClient year={new Date().getFullYear()} />
}
