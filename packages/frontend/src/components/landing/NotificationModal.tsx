import { Box, BoxExtendedProps, Image } from 'grommet';
import { FC, useEffect, useState } from 'react';
import eventBus from '../../utils/eventBus';
import { AppHeading, AppLabel } from '../styles/BasicElements';
import { constants } from './constants';

export interface INotificationModal extends BoxExtendedProps {
  title?: string;
  description?: string;
  icon?: any;
  showDuration?: number;
}

export const NotificationModal: FC<INotificationModal> = (props: INotificationModal) => {
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [notificationData, setNotificationData] = useState(props);

  const showDuration = props.showDuration || 2600;

  const showNotification = (props: INotificationModal): void => {
    setNotificationData(props);
    setNotificationVisible(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setNotificationVisible(false);
    }, showDuration);
  }, [notificationData]);

  useEffect(() => {
    eventBus.on('showNotification', showNotification);

    return () => {
      eventBus.remove('showNotification', showNotification);
    };
  }, []);

  if (!notificationData || !notificationData.title) return <></>;
  return (
    <Box
      style={{
        borderRadius: '8px',
        position: 'absolute',
        maxWidth: '450px',
        maxHeight: '220px',
        right: '10px',
        top: '25px',
        padding: '18px',
        ...props.style,
      }}
      animation={notificationVisible ? 'fadeIn' : 'fadeOut'}
      align="left"
      background={constants.lightBackground}>
      {/* Show Notification Icon if available */}
      {notificationData.icon && (
        <Box>
          <Image src={notificationData.icon} fit="cover" width="48px" height="48px" />
        </Box>
      )}

      <AppHeading style={{ fontSize: '24px' }}>{notificationData?.title} </AppHeading>
      <AppLabel
        style={{ textTransform: 'inherit', fontWeight: 500, fontSize: '18px', color: constants.subParagraphGray }}>
        {notificationData?.description}
      </AppLabel>
    </Box>
  );
};
