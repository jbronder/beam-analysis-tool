import { forwardRef } from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './ComboBox.css';

BeamLoadComboBox.propTypes = {
  onComboSelect: PropTypes.func,
};

function BeamLoadComboBox({ onComboSelect }) {
  return (
    <Select.Root onValueChange={(val) => onComboSelect(val)}>
      <Select.Trigger className="SelectTrigger">
        <Select.Value placeholder="Select a beam-load case combo..." />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon/>
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            <Select.Group>
              <Select.Label className="SelectLabel">Beam-Load Cases</Select.Label>
              <SelectItem value="1">Simple Beam - Uniform Distributed Load</SelectItem>
              <SelectItem value="7">Simple Beam - Concentrated Load At Center</SelectItem>
              <SelectItem value="12">Cantilever Beam - Uniform Distributed Load</SelectItem>
              <SelectItem value="13">Cantilever Beam - Concentrated Load At Free End</SelectItem>
              <SelectItem value="15">Beam Pin-Fixed Ends - Uniform Distributed Load</SelectItem>
              <SelectItem value="23">Beam Fixed At Both Ends - Uniform Distributed Load</SelectItem>
              <SelectItem value="24">Beam Fixed At Both Ends - Concentrated Load At Center</SelectItem>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectItem = forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="SelectItemIndicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = 'SelectItem';
SelectItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  props: PropTypes.object,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default BeamLoadComboBox;
