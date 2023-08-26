import styles from './index.less';
import MicroAppComponent  from '@/components/MicroAppComponent';

export default function IndexPage1() {
  return (
    <div>
      <h1 className={styles.title}>主项目page1</h1>

      <MicroAppComponent 
        name='app1'
        componentName='btn'
        params={{
          text: 'app1项目的btn'
        }}
      />
    </div>
  );
}
