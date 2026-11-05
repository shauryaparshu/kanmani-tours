import { useTranslations } from 'next-intl';
import styles from './EnquiryPage.module.css';

const PHONE_DISPLAY = '+91 95977-16664';
const PHONE_HREF = 'tel:+919597716664';
const EMAIL = 'kanmanitours@gmail.com';

// Phone, email and office set as a credits block. `office` adds the Chennai office and hours.
export default function ContactDetails({ office = true }: { office?: boolean }) {
    const t = useTranslations('Contact');

    return (
        <dl className={styles.credits}>
            <div className={styles.credit}>
                <dt>{t('phoneLabel')}</dt>
                <dd><a href={PHONE_HREF} className="num">{PHONE_DISPLAY}</a></dd>
            </div>
            <div className={styles.credit}>
                <dt>{t('emailLabel')}</dt>
                <dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
            </div>
            {office ? (
                <>
                    <div className={styles.credit}>
                        <dt>{t('officeLabel')}</dt>
                        <dd>{t('office')}</dd>
                    </div>
                    <div className={styles.credit}>
                        <dt>{t('hoursLabel')}</dt>
                        <dd className="num">{t('hours')}</dd>
                    </div>
                </>
            ) : null}
        </dl>
    );
}
