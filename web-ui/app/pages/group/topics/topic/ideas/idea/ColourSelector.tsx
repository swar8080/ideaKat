import * as React from 'react';
import './ColourSelector.scss';
import { IdeaColour, IdeaColourValues } from '../../../../../../model/idea';
import * as classNames from 'classnames';

interface ColourSelectorProps {
    selectedColour?: IdeaColour,
    onClickColour: (colour: IdeaColour) => void
    className?: string,
}

const ColourSelector: React.FC<ColourSelectorProps> = (({selectedColour, onClickColour, className}) => {
    return (
        <div className={classNames("ideaColourSelector", className)}>
            {Object.entries(IdeaColourValues).map(entry => {
                const [colourName, colourValue] = entry;

                const classnames = classNames(
                    'ideaColourSelector__colour',
                    {selected: selectedColour === colourName}
                );
                
                return (
                    <div 
                        className={classnames} 
                        style={{'background': colourValue}}
                        onClick={() => onClickColour(colourName as IdeaColour)}
                        key={colourName}
                    />
                )
            })}
        </div>
    )
});

ColourSelector.defaultProps = {
    className: ""
}


export default ColourSelector;