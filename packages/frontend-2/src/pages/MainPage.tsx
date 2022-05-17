import { InjectedConnector } from "@wagmi/core"
import { FC } from "react"
import { useAccount, useConnect, useEnsName } from "wagmi"
import { useLoggedUser } from "../hooks/useLoggedUser"

export const MainPage: FC = () => {
    const { data: account } = useAccount()
    const { data: ensName } = useEnsName({ address: account?.address })
    const { checkLogin } = useLoggedUser();
    const { connect } = useConnect({
      connector: new InjectedConnector(),
      onConnect: (data) => {
        void checkLogin();
      }
    })

    if (account) return <div>Connected to {ensName ?? account.address}</div>
    return <button onClick={() => connect()}>Connect Wallet</button>
}